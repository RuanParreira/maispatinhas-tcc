<?php

namespace App\Http\Controllers\Profile;

use App\Enums\AdoptionStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\HappyEndingResource;
use App\Models\Adoption;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdoptionController extends Controller
{
    /**
     * Completed adoptions on both sides: pets the user donated and pets the
     * user adopted. The post and animal may have been deleted since, so
     * trashed ones are loaded too.
     */
    public function index(User $user): AnonymousResourceCollection
    {
        $adoptions = Adoption::query()
            ->where('status', AdoptionStatus::Completed)
            ->where(fn ($query) => $query
                ->where('adopter_id', $user->id)
                ->orWhereHas('post', fn ($post) => $post->withTrashed()->where('user_id', $user->id)))
            ->with([
                'adopter:id,name,avatar_path',
                'post' => fn ($query) => $query->withTrashed(),
                'post.user:id,name,avatar_path',
                'post.animal' => fn ($query) => $query->withTrashed(),
                'post.cover',
            ])
            ->orderByDesc('completed_at')
            ->paginate(9);

        return HappyEndingResource::collection($adoptions);
    }
}
