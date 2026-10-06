<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Public profile visibility. The viewer is nullable because guests can see
     * profiles too. Anonymized accounts answer 404 so their existence is not confirmed.
     */
    public function view(?User $viewer, User $user): Response
    {
        return $user->anonymized_at === null
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}
