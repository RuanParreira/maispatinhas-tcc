<?php

namespace App\Policies;

use App\Enums\PostStatus;
use App\Enums\UserStatus;
use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Posts ativos e reencontros são públicos. Os demais (em moderação, rejeitados, pausados...)
     * só são vistos pelo dono, por admins e por quem conversou sobre o anúncio (o "Ver anúncio"
     * do chat continua funcionando depois da adoção); os outros recebem 404 para não revelar que existem.
     */
    public function view(?User $user, Post $post): Response
    {
        if ($post->status === PostStatus::Active || $post->isReunion()) {
            return Response::allow();
        }

        if ($user === null) {
            return Response::denyAsNotFound();
        }

        return $user->id === $post->user_id
            || $user->isAdmin()
            || $post->conversations()->where('interested_id', $user->id)->exists()
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    /**
     * Favorito é para guardar pets de outras pessoas, e só de anúncios que a pessoa pode ver.
     */
    public function favorite(User $user, Post $post): Response
    {
        $visibility = $this->view($user, $post);

        if ($visibility->denied()) {
            return $visibility;
        }

        return $user->id === $post->user_id
            ? Response::deny('Você não pode favoritar o próprio anúncio.')
            : Response::allow();
    }

    /**
     * Abrir conversa com o anunciante. Conta suspensa ou banida não inicia contato.
     */
    public function contact(User $user, Post $post): Response
    {
        $visibility = $this->view($user, $post);

        if ($visibility->denied()) {
            return $visibility;
        }

        if ($user->id === $post->user_id) {
            return Response::deny('Você não pode conversar com você mesmo.');
        }

        return $user->status === UserStatus::Active
            ? Response::allow()
            : Response::deny('Sua conta não pode enviar mensagens.');
    }

    public function update(User $user, Post $post): Response
    {
        if ($user->id !== $post->user_id && ! $user->isAdmin()) {
            return Response::deny('Você não tem permissão para editar este anúncio.');
        }

        return $post->status->isFinished()
            ? Response::deny('Este anúncio foi finalizado e não pode ser editado.')
            : Response::allow();
    }

    public function delete(User $user, Post $post): Response
    {
        return $user->id === $post->user_id || $user->isAdmin()
            ? Response::allow()
            : Response::deny('Você não tem permissão para cancelar este anúncio.');
    }
}
