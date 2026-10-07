<?php

namespace App\Policies;

use App\Models\Animal;
use App\Models\User;

class AnimalPolicy
{
    /**
     * Define se o usuário pode listar os animais.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Define se o usuário pode ver o animal.
     */
    public function view(User $user, Animal $animal): bool
    {
        return $user->id === $animal->user_id;
    }

    /**
     * Define se o usuário pode cadastrar animais.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Define se o usuário pode atualizar o animal.
     */
    public function update(User $user, Animal $animal): bool
    {
        return $user->id === $animal->user_id;
    }

    /**
     * Define se o usuário pode excluir o animal.
     */
    public function delete(User $user, Animal $animal): bool
    {
        return $user->id === $animal->user_id;
    }

    /**
     * Define se o usuário pode restaurar o animal.
     */
    public function restore(User $user, Animal $animal): bool
    {
        return false;
    }

    /**
     * Define se o usuário pode excluir o animal permanentemente.
     */
    public function forceDelete(User $user, Animal $animal): bool
    {
        return false;
    }
}
