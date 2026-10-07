<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Visibilidade do perfil público. O visitante é opcional porque quem não está logado
     * também vê perfis. Contas anonimizadas respondem 404 para não confirmar que existem.
     */
    public function view(?User $viewer, User $user): Response
    {
        return $user->anonymized_at === null
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}
