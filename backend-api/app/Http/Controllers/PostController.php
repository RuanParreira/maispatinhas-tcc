<?php

namespace App\Http\Controllers;

use App\Enums\AnimalAgeGroup;
use App\Http\Requests\Post\ListPostsRequest;
use App\Http\Resources\PostCardResource;
use App\Http\Resources\PostResource;
use App\Models\Animal;
use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    private const PHOTO_MAX_SIZE = 1600;

    /**
     * Listar anúncios públicos (apenas ativos).
     */
    public function index(ListPostsRequest $request): AnonymousResourceCollection
    {
        $filters = $request->validated();

        $posts = Post::active()
            ->when($filters['type'] ?? null, fn (Builder $query, string $type) => $query->where('type', $type))
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
            ->with(['animal', 'municipality:ibge_code,name,state', 'user:id,name,avatar_path', 'cover'])
            ->when(
                ($filters['sort'] ?? null) === 'name',
                fn (Builder $query) => $query->orderBy(Animal::select('name')->whereColumn('animals.id', 'posts.animal_id')),
                fn (Builder $query) => $query->latest('published_at'),
            )
            ->paginate(15)
            ->withQueryString();

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
