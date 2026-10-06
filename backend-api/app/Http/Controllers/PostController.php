<?php

namespace App\Http\Controllers;

use App\Enums\PostStatus;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Resources\PostCardResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    /**
     * Listar anuncios publicos (apenas aprovados/ativos), com filtro opcional por anunciante.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $posts = Post::with(['animal', 'municipality:ibge_code,name,state', 'user:id,name,avatar_path', 'cover'])
            ->where('status', PostStatus::Active)
            ->when($request->integer('user'), fn ($query, $userId) => $query->where('user_id', $userId))
            ->latest('published_at')
            ->paginate(15);

        return PostCardResource::collection($posts);
    }

    /**
     * Cadastrar um novo post
     */
    public function store(StorePostRequest $request)
    {
        // cria a instancia com os dados validados permitidos
        $post = new Post($request->safe()->except(['animal_id']));

        // define as chaves protegidas e o status inicial para a moderação
        $post->user_id = $request->user()->id;
        $post->animal_id = $request->validated('animal_id');
        $post->status = PostStatus::PendingApproval; // vai para a moderação
        $post->save();

        // carrega os relacionamentos
        $post->load(['animal', 'municipality']);

        return response()->json($post, 201);
    }

    /**
     * Detalhes de um anúncio específico
     */
    public function show(Post $post)
    {
        $post->load(['animal', 'municipality', 'user:id,name,avatar_path']);

        return response()->json($post);
    }

    /**
     * Listar os anúncios do próprio usuário autenticado.
     */
    public function myPosts(Request $request)
    {
        return $request->user()
            ->posts()
            ->with(['animal', 'municipality'])
            ->latest()
            ->get();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
