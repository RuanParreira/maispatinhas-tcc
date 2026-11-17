<?php

namespace App\Http\Controllers;

use App\Enums\PostStatus;
use App\Http\Resources\PostCardResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class FavoriteController extends Controller
{
    /**
     * Anúncios ativos que o usuário favoritou, mais recentes primeiro.
     * Sem paginação: paginar se os usuários acumularem muitos favoritos.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $posts = $request->user()
            ->favoritePosts()
            ->active()
            ->withFavoriteFlag($request->user())
            ->with(['animal', 'municipality:ibge_code,name,state', 'user:id,name,avatar_path', 'cover'])
            ->get();

        return PostCardResource::collection($posts);
    }

    /**
     * Favorita o anúncio. Repetir a chamada não duplica o registro. Só ativos: um
     * reencontro é público, mas favoritá-lo criaria um registro que a lista nunca mostra.
     */
    public function store(Request $request, Post $post): Response
    {
        Gate::authorize('view', $post);
        abort_unless($post->status === PostStatus::Active, 409, 'Só anúncios publicados podem ser favoritados.');

        $request->user()->favoritePosts()->syncWithoutDetaching([$post->id]);

        return response()->noContent();
    }

    /**
     * Remove o anúncio dos favoritos.
     */
    public function destroy(Request $request, Post $post): Response
    {
        $request->user()->favoritePosts()->detach($post->id);

        return response()->noContent();
    }
}
