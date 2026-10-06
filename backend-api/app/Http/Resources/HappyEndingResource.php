<?php

namespace App\Http\Resources;

use App\Models\Adoption;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A completed adoption shown on the donor's profile.
 *
 * @mixin Adoption
 */
class HappyEndingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'completed_at' => $this->completed_at?->toIso8601String(),
            'adopter' => [
                'id' => $this->adopter->id,
                'name' => $this->adopter->name,
            ],
            'pet' => [
                'name' => $this->post->animal->name,
                'species' => $this->post->animal->species,
                'cover_url' => $this->post->cover?->url,
            ],
        ];
    }
}
