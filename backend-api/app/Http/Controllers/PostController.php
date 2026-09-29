<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Enums\PostStatus;
use App\Http\Requests\Post\StorePostRequest;
use App\Models\Post;

class PostController extends Controller
{
    /**
     * Listar anuncios publicos (apenas aprovados/ativos)
     */
    public function index(Request $request)
    {
        return Post::with(['animal', 'municipality', 'user:id,name'])
            ->where('status', PostStatus::Active)
            ->latest('published_at')
            ->paginate(15);
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
        $post->load(['animal', 'municipality', 'user:id,name']);

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
