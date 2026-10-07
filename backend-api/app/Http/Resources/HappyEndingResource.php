<?php

namespace App\Http\Resources;

use App\Models\Adoption;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Uma adoção concluída exibida no perfil. role indica de que lado o dono
 * do perfil estava: donor (doou o pet) ou adopter (levou para casa).
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
            'role' => $this->adopter_id === $request->route('user')->id ? 'adopter' : 'donor',
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
