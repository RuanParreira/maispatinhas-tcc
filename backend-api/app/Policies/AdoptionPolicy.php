<?php

namespace App\Policies;

use App\Models\Adoption;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AdoptionPolicy
{
    /**
     * Só quem foi indicado como adotante confirma ou nega. Os demais recebem 404
     * para não revelar a indicação.
     */
    public function respond(User $user, Adoption $adoption): Response
    {
        return $user->id === $adoption->adopter_id
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}
