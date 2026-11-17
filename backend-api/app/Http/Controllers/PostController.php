<?php

namespace App\Http\Controllers;

use App\Enums\AnimalAgeGroup;
use App\Enums\PostStatus;
use App\Http\Requests\Post\ListPostsRequest;
use App\Http\Resources\PostCardResource;
use App\Http\Resources\PostResource;
use App\Models\Animal;
use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    /**
     * Listar anúncios públicos: os ativos ou, com status=resolved, os reencontros.
     * Adoção concluída não entra: ela aparece no perfil, como final feliz.
     */
    public function index(ListPostsRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $reunions = ($filters['status'] ?? null) === PostStatus::Resolved->value;

        $posts = Post::query()
            ->when($reunions, fn (Builder $query) => $query->reunited(), fn (Builder $query) => $query->active())
            ->when($filters['type'] ?? null, fn (Builder $query, array $types) => $query->whereIn('type', $types))
            ->when($filters['search'] ?? null, fn (Builder $query, string $search) => $query->where(
                fn (Builder $query) => $query
                    ->whereHas('animal', fn (Builder $animal) => $animal
                        ->whereLike('name', "%{$search}%")
                        ->orWhereLike('breed', "%{$search}%"))
                    ->orWhereHas('municipality', fn (Builder $municipality) => $municipality->whereLike('name', "%{$search}%")),
            ))
            ->whereHas('animal', fn (Builder $animal) => $animal
                ->when($filters['species'] ?? null, fn (Builder $query, string $species) => $query->where('species', $species))
                ->when($filters['size'] ?? null, fn (Builder $query, string $size) => $query->where('size', $size))
                ->when($filters['sex'] ?? null, fn (Builder $query, string $sex) => $query->where('sex', $sex))
                ->when($filters['age_group'] ?? null, fn (Builder $query, string $group) => $query->inAgeGroup(AnimalAgeGroup::from($group))))
            ->withFavoriteFlag($request->user('sanctum'))
            ->with(['animal', 'municipality:ibge_code,name,state', 'user:id,name,avatar_path', 'cover'])
            ->when(
                ($filters['sort'] ?? null) === 'name',
                fn (Builder $query) => $query->orderBy(Animal::select('name')->whereColumn('animals.id', 'posts.animal_id')),
                fn (Builder $query) => $query->latest($reunions ? 'updated_at' : 'published_at'),
            )
            ->paginate(15)
            ->withQueryString();

        return PostCardResource::collection($posts);
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
}
