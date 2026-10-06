<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * What anyone can see about a user. Contact data (email, phone) is never public.
 *
 * @mixin User
 */
class PublicProfileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'bio' => $this->bio,
            'avatar_url' => $this->avatar_url,
            'municipality' => [
                'name' => $this->municipality->name,
                'state' => $this->municipality->state,
            ],
            'email_verified' => $this->email_verified_at !== null,
            'member_since' => $this->created_at->toIso8601String(),
            'stats' => [
                'adoptions_completed' => $this->adoptions_donated_count + $this->adoptions_adopted_count,
                'adoptions_donated' => $this->adoptions_donated_count,
                'adoptions_adopted' => $this->adoptions_adopted_count,
                'active_posts' => $this->active_posts_count,
                'reviews_count' => $this->reviews_count,
                'rating' => $this->rating === null ? null : round((float) $this->rating, 1),
            ],
        ];
    }
}
