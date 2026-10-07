<?php

namespace App\Http\Controllers;

use App\Actions\EncodeImageAsWebp;
use App\Enums\PostStatus;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Resources\PostCardResource;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\PostFile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
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
     * Listar anúncios públicos (apenas ativos).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $posts = Post::active()
            ->when($request->query('type'), fn ($query, $type) => $query->where('type', $type))
            ->with(['animal', 'municipality:ibge_code,name,state', 'cover'])
            ->latest('published_at')
            ->paginate(15);

        return PostCardResource::collection($posts);
    }

    /**
     * Cadastrar um novo post. Post e fotos são salvos juntos: se algo falhar,
     * a transação desfaz o banco e as fotos já gravadas são apagadas do disco.
     */
    public function store(StorePostRequest $request, EncodeImageAsWebp $encodeImageAsWebp): JsonResponse
    {
        $storedPaths = [];

        try {
            $post = DB::transaction(function () use ($request, $encodeImageAsWebp, &$storedPaths) {
                $post = new Post($request->safe()->except(['animal_id', 'images']));
                $post->user_id = $request->user()->id;
                $post->animal_id = $request->validated('animal_id');
                $post->status = PostStatus::PendingApproval;
                $post->save();

                foreach ($request->file('images', []) as $position => $upload) {
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
                    $file->position = $position;
                    $post->files()->save($file);
                }

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
     * Detalhes de um anúncio específico.
     */
    public function show(Post $post): PostResource
    {
        Gate::authorize('view', $post);

        $post->load(['animal', 'municipality:ibge_code,name,state', 'user:id,name,avatar_path', 'files']);

        return new PostResource($post);
    }

    /**
     * Listar os anúncios do próprio usuário autenticado.
     */
    public function myPosts(Request $request): AnonymousResourceCollection
    {
        $posts = $request->user()
            ->posts()
            ->with(['animal', 'municipality:ibge_code,name,state', 'cover'])
            ->latest()
            ->get();

        return PostResource::collection($posts);
    }

    /**
     * Atualiza o anúncio informado.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove o anúncio informado.
     */
    public function destroy(string $id)
    {
        //
    }
}