<?php

namespace App\Policies;

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Posts ativos são públicos. Os demais (em moderação, rejeitados, pausados...) só são
     * vistos pelo dono e por admins; os outros recebem 404 para não revelar que existem.
     */
    public function view(?User $user, Post $post): Response
    {
        if ($post->status === PostStatus::Active) {
            return Response::allow();
        }

        return $user !== null && ($user->id === $post->user_id || $user->isAdmin())
            ? Response::allow()
            : Response::denyAsNotFound();
    }
}
