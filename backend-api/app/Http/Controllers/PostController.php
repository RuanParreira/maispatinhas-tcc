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
            ->when($request->query('type'), fn($query, $type) => $query->where('type', $type))
            ->with(['animal', 'municipality:ibge_code,name,state', 'cover'])
            ->latest('published_at')
            ->paginate(15);

        return PostCardResource::collection($posts);
    }

    /**
     * Cadastrar um novo post. Post e fotos são salvos juntos: se algo falhar,
     * a transação desfaz o banco e as fotos já gravadas são apagadas do disco.
     */
    public function store()
    {
        //
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
