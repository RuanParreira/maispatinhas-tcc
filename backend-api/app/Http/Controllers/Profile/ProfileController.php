<?php

namespace App\Http\Controllers\Profile;

use App\Enums\AdoptionStatus;
use App\Enums\PostStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\PublicProfileResource;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Public profile of any user. Visibility is checked by UserPolicy on the route.
     */
    public function show(User $user): PublicProfileResource
    {
        $user->load('municipality:ibge_code,name,state')
            ->loadCount([
                'donatedAdoptions as adoptions_donated_count' => fn ($query) => $query
                    ->where('adoptions.status', AdoptionStatus::Completed),
                'adoptions as adoptions_adopted_count' => fn ($query) => $query
                    ->where('status', AdoptionStatus::Completed),
                'posts as active_posts_count' => fn ($query) => $query
                    ->where('status', PostStatus::Active),
                'reviewsReceived as reviews_count',
            ])
            ->loadAvg('reviewsReceived as rating', 'rating');

        return new PublicProfileResource($user);
    }
}
