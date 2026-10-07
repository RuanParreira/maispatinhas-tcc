<?php

namespace App\Http\Controllers\Profile;

use App\Enums\AdoptionStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\PublicProfileResource;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Perfil público de qualquer usuário. A visibilidade é checada pela UserPolicy na rota.
     */
    public function show(User $user): PublicProfileResource
    {
        $user->load('municipality:ibge_code,name,state')
            ->loadCount([
                'donatedAdoptions as adoptions_donated_count' => fn ($query) => $query
                    ->where('adoptions.status', AdoptionStatus::Completed),
                'adoptions as adoptions_adopted_count' => fn ($query) => $query
                    ->where('status', AdoptionStatus::Completed),
                'posts as active_posts_count' => fn ($query) => $query->active(),
                'reviewsReceived as reviews_count',
            ])
            ->loadAvg('reviewsReceived as rating', 'rating');

        return new PublicProfileResource($user);
    }
}
