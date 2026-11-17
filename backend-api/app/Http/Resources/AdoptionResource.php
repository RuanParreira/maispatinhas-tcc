<?php

namespace App\Http\Resources;

use App\Models\Adoption;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Adoção vista pelo adotante em Minhas adoções. Mesmo formato do HappyEndingResource,
 * para reaproveitar o card do perfil, mais o status para separar as pendentes.
 *
 * @mixin Adoption
 */
class AdoptionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'role' => 'adopter',
            'created_at' => $this->created_at->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'post_id' => $this->post_id,
            'donor' => new UserSummaryResource($this->post->user),
            'adopter' => new UserSummaryResource($this->adopter),
            'pet' => [
                'name' => $this->post->animal->name,
                'species' => $this->post->animal->species,
                'cover_url' => $this->post->cover?->url,
            ],
        ];
    }
}
