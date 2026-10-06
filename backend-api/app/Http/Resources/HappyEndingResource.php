<?php

namespace App\Http\Resources;

use App\Models\Adoption;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A completed adoption shown on a profile. role tells which side the
 * profile owner was on: donor (gave the pet) or adopter (took it home).
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
            'donor' => [
                'id' => $this->post->user->id,
                'name' => $this->post->user->name,
                'avatar_url' => $this->post->user->avatar_url,
            ],
            'adopter' => [
                'id' => $this->adopter->id,
                'name' => $this->adopter->name,
                'avatar_url' => $this->adopter->avatar_url,
            ],
            'pet' => [
                'name' => $this->post->animal->name,
                'species' => $this->post->animal->species,
                'cover_url' => $this->post->cover?->url,
            ],
        ];
    }
}
