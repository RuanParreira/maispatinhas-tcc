<?php

namespace App\Http\Controllers;

use App\Enums\PostStatus;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Resources\PostCardResource;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Listar todos os anuncios, a filtragem é feita na policy
     */
    public function index(Request $request)
    {
        // loading para trazer o animal, fotos e tutor
        $query = Post::with(['animal', 'municipality', 'user:id,name', 'files']);

        // se não for admin, traz apenas os posts aprovados
        if (!$request->user()?->isAdmin()) {
            $query->where('status', PostStatus::Active)
                ->latest('published_at');
        } else {
            // se for admin, traz todos
            if ($request->filled('status')) {
                $query->where('status', $request->query('status'));
            }

            $query->latest();
        }

        return $query->paginate(15);
    }

    /**
     * Cadastrar um novo post
     */
    public function store(StorePostRequest $request)
    {
        $post = new Post($request->safe()->except(['animal_id', 'images']));
        $post->user_id = $request->user()->id;
        $post->animal_id = $request->validated('animal_id');
        $post->status = PostStatus::PendingApproval;
        $post->save();

        // se foi enviado imagens
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $position => $file) {
                // salva na public /posts
                $path = $file->store('posts', 'public');

                $post->files()->create([
                    'original_name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'disk' => 'public',
                    'hash' => hash_file('sha256', $file->getRealPath()),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'position' => $position,
                ]);
            }
        }

        $post->load(['animal', 'municipality', 'files']);

        return response()->json($post, 201);
    }

    /**
     * Detalhes de um anúncio específico
     */
    public function show(Request $request, Post $post)
    {
        // se o post não for ativo, só o dono e o admin tem acesso
        if ($post->status !== PostStatus::Active) {
            $user = $request->user();

            abort_unless(
                $user && ($user->id === $post->user_id || $user->isAdmin()),
                403,
                'Este anúncio ainda está em moderação.'
            );
        }

        $post->load(['animal', 'municipality', 'user:id,name', 'files']);

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
