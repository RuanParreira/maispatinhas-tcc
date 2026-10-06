<?php

namespace App\Http\Controllers\Profile;

use App\Enums\AdoptionStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\HappyEndingResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdoptionController extends Controller
{
    /**
     * Completed adoptions where the user was the donor. The post and animal
     * may have been deleted since, so trashed ones are loaded too.
     */
    public function index(User $user): AnonymousResourceCollection
    {
        $adoptions = $user->donatedAdoptions()
            ->where('adoptions.status', AdoptionStatus::Completed)
            ->with([
                'adopter:id,name',
                'post' => fn ($query) => $query->withTrashed(),
                'post.animal' => fn ($query) => $query->withTrashed(),
                'post.cover',
            ])
            ->orderByDesc('adoptions.completed_at')
            ->paginate(9);

        return HappyEndingResource::collection($adoptions);
    }
}
