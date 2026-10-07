<?php

namespace App\Http\Resources;

use App\Models\Post;
use App\Models\PostFile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Post completo, para a página de detalhe e a listagem do próprio dono.
 * Dados de moderação (approved_by, approved_at) e detalhes internos dos arquivos nunca saem da API.
 *
 * @mixin Post
 */
class PostResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'status' => $this->status,
            'title' => $this->title,
            'description' => $this->description,
            'occurred_at' => $this->occurred_at?->toDateString(),
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'cover_url' => $this->whenLoaded('cover', fn () => $this->cover?->url),
            'photos' => $this->whenLoaded('files', fn () => $this->files->map(fn (PostFile $file) => [
                'id' => $file->id,
                'url' => $file->url,
            ])),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar_url' => $this->user->avatar_url,
            ]),
            'municipality' => $this->whenLoaded('municipality', fn () => [
                'name' => $this->municipality->name,
                'state' => $this->municipality->state,
            ]),
            'animal' => $this->whenLoaded('animal', fn () => [
                'name' => $this->animal->name,
                'species' => $this->animal->species,
                'breed' => $this->animal->breed,
                'sex' => $this->animal->sex,
                'size' => $this->animal->size,
                'color' => $this->animal->color,
                'distinctive_features' => $this->animal->distinctive_features,
                'birth_date' => $this->animal->approximate_birth_date->toDateString(),
                'vaccinated' => $this->animal->vaccinated,
                'dewormed' => $this->animal->dewormed,
                'neutered' => $this->animal->neutered,
            ]),
        ];
    }
}
