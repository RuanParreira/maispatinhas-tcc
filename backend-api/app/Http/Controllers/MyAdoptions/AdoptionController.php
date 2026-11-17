<?php

namespace App\Http\Controllers\MyAdoptions;

use App\Enums\AdoptionStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\AdoptionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdoptionController extends Controller
{
    /**
     * Pets que o usuário adotou e indicações aguardando a confirmação dele.
     * Recusadas e canceladas não aparecem: para o adotante, não aconteceram.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $adoptions = $request->user()
            ->adoptions()
            ->whereIn('status', [AdoptionStatus::InProgress, AdoptionStatus::Completed])
            ->with([
                'adopter:id,name,avatar_path,anonymized_at',
                'post' => fn ($query) => $query->withTrashed(),
                'post.user:id,name,avatar_path,anonymized_at',
                'post.animal' => fn ($query) => $query->withTrashed(),
                'post.cover',
            ])
            ->orderByDesc('completed_at')
            ->latest()
            ->get();

        return AdoptionResource::collection($adoptions);
    }
}
