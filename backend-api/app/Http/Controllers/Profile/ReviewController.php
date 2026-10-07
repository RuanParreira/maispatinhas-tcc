<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReviewController extends Controller
{
    /**
     * Avaliações que o usuário recebeu, mais recentes primeiro.
     */
    public function index(User $user): AnonymousResourceCollection
    {
        $reviews = $user->reviewsReceived()
            ->with([
                'reviewer:id,name,avatar_path',
                'adoption.post' => fn ($query) => $query->withTrashed(),
                'adoption.post.animal' => fn ($query) => $query->withTrashed(),
            ])
            ->latest()
            ->paginate(10);

        return ReviewResource::collection($reviews);
    }
}
