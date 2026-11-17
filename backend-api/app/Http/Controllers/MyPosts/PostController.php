<?php

namespace App\Http\Controllers\MyPosts;

use App\Actions\EncodeImageAsWebp;
use App\Http\Controllers\Controller;
use App\Enums\AdoptionStatus;
use App\Enums\PostStatus;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\PostFile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Interfaces\ImageInterface;
use Throwable;

class PostController extends Controller
{
    private const PHOTO_MAX_SIZE = 1600;

    /**
     * Listar os anúncios do próprio usuário autenticado.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $posts = $request->user()
            ->posts()
            ->with(['animal', 'municipality:ibge_code,name,state', 'cover', 'latestRejection'])
            ->latest()
            ->get();

        return PostResource::collection($posts);
    }

    /**
     * Cadastrar um novo post junto com o seu animal. Animal, post e fotos são salvos juntos:
     * se algo falhar, a transação desfaz o banco e as fotos já gravadas são apagadas do disco.
     */
    public function store(StorePostRequest $request, EncodeImageAsWebp $encodeImageAsWebp): JsonResponse
    {
        $storedPaths = [];

        try {
            $post = DB::transaction(function () use ($request, $encodeImageAsWebp, &$storedPaths) {
                $animal = $request->user()->animals()->create($request->validated('animal'));

                $post = new Post($request->safe()->except(['animal', 'images']));
                $post->user_id = $request->user()->id;
                $post->animal_id = $animal->id;
                $post->status = PostStatus::PendingApproval;
                $post->save();

                $this->storePhotos($post, $request->file('images', []), $encodeImageAsWebp, 0, $storedPaths);

                return $post;
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($storedPaths);

            throw $exception;
        }

        $post->load(['animal', 'municipality', 'files']);

        return (new PostResource($post))->response()->setStatusCode(201);
    }

    /**
     * Atualiza o anúncio e o seu animal. Remove as fotos pedidas, adiciona as novas
     * no fim e, se algo mudou num post já moderado, devolve para aprovação. Pausado e
     * expirado também voltam: retomar e renovar não passam pela moderação.
     */
    public function update(UpdatePostRequest $request, Post $post, EncodeImageAsWebp $encodeImageAsWebp): PostResource
    {
        $storedPaths = [];
        $removedPaths = [];

        try {
            DB::transaction(function () use ($request, $post, $encodeImageAsWebp, &$storedPaths, &$removedPaths) {
                $post->fill($request->safe()->except(['animal', 'images', 'delete_photo_ids', 'photo_order']));
                $post->animal->fill($request->validated('animal', []));

                $removed = $post->files()->whereIn('id', $request->validated('delete_photo_ids', []))->get();
                $removedPaths = $removed->pluck('path')->all();
                $removed->each->delete();

                $nextPosition = ($post->files()->reorder()->max('position') ?? -1) + 1;
                $newFiles = $this->storePhotos($post, $request->file('images', []), $encodeImageAsWebp, $nextPosition, $storedPaths);
                $reordered = $this->applyPhotoOrder($post, $request->validated('photo_order'), $newFiles);

                $changed = $post->isDirty() || $post->animal->isDirty() || $removedPaths !== [] || $storedPaths !== [] || $reordered;

                if ($changed && in_array($post->status, [PostStatus::Active, PostStatus::Rejected, PostStatus::Paused, PostStatus::Expired], true)) {
                    $post->status = PostStatus::PendingApproval;
                }

                $post->animal->save();
                $post->save();
            });
        } catch (Throwable $exception) {
            Storage::disk('public')->delete($storedPaths);

            throw $exception;
        }

        // Só apaga do disco depois do commit: se a transação falhasse, as fotos ainda seriam do post.
        Storage::disk('public')->delete($removedPaths);

        return new PostResource($post->load(['animal', 'municipality', 'files']));
    }

    /**
     * O "excluir" do autor cancela o anúncio: ele sai do catálogo, mas continua no banco
     * com o animal, porque conversas, moderações e o histórico apontam para ele.
     * Com adoção aguardando confirmação, o doador precisa desfazer a indicação antes.
     */
    public function destroy(Post $post): Response
    {
        Gate::authorize('delete', $post);

        abort_if(
            $post->status->isFinished(),
            409,
            'Este anúncio já foi finalizado e não pode ser cancelado.'
        );
        abort_if(
            $post->adoptions()->where('status', AdoptionStatus::InProgress)->exists(),
            409,
            'Há uma adoção aguardando confirmação. Desfaça a indicação antes de cancelar o anúncio.'
        );

        $post->status = PostStatus::Canceled;
        $post->save();

        return response()->noContent();
    }

    /**
     * Recodifica e grava as fotos a partir de $position. Cada caminho entra em $storedPaths
     * assim que é gravado, para que quem chamou consiga limpar o disco se algo falhar no meio.
     *
     * @param  array<int, UploadedFile>  $uploads
     * @param  array<int, string>  $storedPaths
     * @return array<int, PostFile>
     */
    private function storePhotos(Post $post, array $uploads, EncodeImageAsWebp $encodeImageAsWebp, int $position, array &$storedPaths): array
    {
        $files = [];

        foreach ($uploads as $upload) {
            $image = $encodeImageAsWebp->handle(
                $upload,
                fn (ImageInterface $image) => $image->scaleDown(self::PHOTO_MAX_SIZE, self::PHOTO_MAX_SIZE),
            );

            $path = "posts/{$post->id}/".Str::uuid().'.webp';
            Storage::disk('public')->put($path, $image);
            $storedPaths[] = $path;

            $file = new PostFile;
            $file->path = $path;
            $file->disk = 'public';
            $file->hash = hash('sha256', $image);
            $file->size = strlen($image);
            $file->mime_type = 'image/webp';
            $file->position = $position++;
            $post->files()->save($file);
            $files[] = $file;
        }

        return $files;
    }

    /**
     * Reposiciona as fotos conforme photo_order ("id:{id}" ou "new:{índice}"), já
     * validado contra as fotos do post. Diz se alguma posição mudou.
     *
     * @param  array<int, string>|null  $order
     * @param  array<int, PostFile>  $newFiles
     */
    private function applyPhotoOrder(Post $post, ?array $order, array $newFiles): bool
    {
        if ($order === null) {
            return false;
        }

        $filesByToken = $post->files()->get()->keyBy(fn (PostFile $file) => "id:{$file->id}");
        foreach ($newFiles as $index => $file) {
            $filesByToken["new:$index"] = $file;
        }

        $reordered = false;
        foreach ($order as $position => $token) {
            $file = $filesByToken[$token];
            $file->position = $position;
            $reordered = $reordered || $file->isDirty('position');
            $file->save();
        }

        return $reordered;
    }
}
