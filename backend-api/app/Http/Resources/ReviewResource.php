<?php

namespace App\Http\Resources;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Review
 */
class ReviewResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'created_at' => $this->created_at->toIso8601String(),
            'reviewer' => [
                'id' => $this->reviewer->id,
                'name' => $this->reviewer->name,
                'avatar_url' => $this->reviewer->avatar_url,
            ],
            'reviewer_role' => $this->reviewer_id === $this->adoption->adopter_id ? 'adopter' : 'donor',
            'pet_name' => $this->adoption->post->animal->name,
        ];
    }
}
