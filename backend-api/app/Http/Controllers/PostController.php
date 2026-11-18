<?php

namespace App\Http\Controllers;

use App\Enums\AnimalAgeGroup;
use App\Enums\PostStatus;
use App\Http\Requests\Post\ListPostsRequest;
use App\Http\Resources\PostCardResource;
use App\Http\Resources\PostResource;
use App\Models\Municipality;
use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    /**
     * Listar anúncios públicos: os ativos ou, com status=resolved, os reencontros.
     * Adoção concluída não entra: ela aparece no perfil, como final feliz.
     * Com near, a busca é regional: só cidades até radius km, e sort=distance põe as mais perto primeiro.
     */
    public function index(ListPostsRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $reunions = ($filters['status'] ?? null) === PostStatus::Resolved->value;
        $origin = isset($filters['near']) ? Municipality::find($filters['near']) : null;
        $sort = $filters['sort'] ?? 'recent';
        $newestFirst = fn (Builder $query) => $query->latest($reunions ? 'posts.updated_at' : 'posts.published_at');

        $posts = Post::query()
            ->when($origin, fn (Builder $query) => $query->nearTo($origin, $filters['radius'] ?? null))
            ->when($reunions, fn (Builder $query) => $query->reunited(), fn (Builder $query) => $query->active())
            ->when($filters['type'] ?? null, fn (Builder $query, array $types) => $query->whereIn('type', $types))
            ->whereHas('animal', fn (Builder $animal) => $animal
                ->when($filters['species'] ?? null, fn (Builder $query, string $species) => $query->where('species', $species))
                ->when($filters['size'] ?? null, fn (Builder $query, string $size) => $query->where('size', $size))
                ->when($filters['sex'] ?? null, fn (Builder $query, string $sex) => $query->where('sex', $sex))
                ->when($filters['age_group'] ?? null, fn (Builder $query, string $group) => $query->inAgeGroup(AnimalAgeGroup::from($group))))
            ->withFavoriteFlag($request->user('sanctum'))
            ->with(['animal', 'municipality:ibge_code,name,state', 'user:id,name,avatar_path', 'cover'])
            ->when(
                $sort === 'distance' && $origin,
                fn (Builder $query) => $newestFirst($query->orderBy('distance_sq')),
                $newestFirst,
            )
            ->paginate(15)
            ->withQueryString();

        return PostCardResource::collection($posts);
    }

    /**
     * Detalhes de um anúncio específico. is_favorite só vai para o usuário logado.
     */
    public function show(Request $request, Post $post): PostResource
    {
        Gate::authorize('view', $post);

        $post->load(['animal', 'municipality:ibge_code,name,state', 'user:id,name,avatar_path,anonymized_at', 'files']);

        if ($user = $request->user('sanctum')) {
            $post->is_favorite = $user->favoritePosts()->whereKey($post->id)->exists();
        }

        return new PostResource($post);
    }
}
