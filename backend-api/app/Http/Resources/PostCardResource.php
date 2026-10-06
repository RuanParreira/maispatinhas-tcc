<?php

namespace App\Http\Resources;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Summary of a post for listing cards.
 *
 * @mixin Post
 */
class PostCardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'published_at' => $this->published_at?->toIso8601String(),
            'cover_url' => $this->cover?->url,
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),
            'municipality' => [
                'name' => $this->municipality->name,
                'state' => $this->municipality->state,
            ],
            'animal' => [
                'name' => $this->animal->name,
                'species' => $this->animal->species,
                'breed' => $this->animal->breed,
                'sex' => $this->animal->sex,
                'size' => $this->animal->size,
                'birth_date' => $this->animal->approximate_birth_date->toDateString(),
                'vaccinated' => $this->animal->vaccinated,
                'neutered' => $this->animal->neutered,
            ],
        ];
    }
}
