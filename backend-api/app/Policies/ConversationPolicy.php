<?php

namespace App\Policies;

use App\Enums\ConversationStatus;
use App\Enums\PostStatus;
use App\Enums\UserStatus;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ConversationPolicy
{
    /**
     * Só os dois participantes enxergam a conversa; os outros recebem 404.
     */
    public function view(User $user, Conversation $conversation): Response
    {
        return $conversation->hasParticipant($user)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    /**
     * Conversa arquivada (a outra pessoa excluiu a conta) já não recebe mensagens.
     */
    public function block(User $user, Conversation $conversation): Response
    {
        $visibility = $this->view($user, $conversation);

        if ($visibility->denied()) {
            return $visibility;
        }

        return $conversation->status === ConversationStatus::Active
            ? Response::allow()
            : Response::deny('Esta conversa não pode ser bloqueada.');
    }

    public function unblock(User $user, Conversation $conversation): Response
    {
        $visibility = $this->view($user, $conversation);

        if ($visibility->denied()) {
            return $visibility;
        }

        return $conversation->status === ConversationStatus::Blocked && $conversation->blocked_by === $user->id
            ? Response::allow()
            : Response::deny('Só quem bloqueou pode desbloquear a conversa.');
    }

    /**
     * Pausado, expirado ou resolvido ainda aceita mensagem, porque as partes podem
     * estar combinando a entrega. Anúncio cancelado e conversa arquivada (a outra
     * pessoa excluiu a conta) ficam só para leitura.
     */
    public function send(User $user, Conversation $conversation): Response
    {
        $visibility = $this->view($user, $conversation);

        if ($visibility->denied()) {
            return $visibility;
        }

        if ($user->status !== UserStatus::Active) {
            return Response::deny('Sua conta não pode enviar mensagens.');
        }

        if ($conversation->status !== ConversationStatus::Active) {
            return Response::deny('Esta conversa não aceita mais mensagens.');
        }

        return $conversation->post->status === PostStatus::Canceled
            ? Response::deny('Este anúncio foi cancelado.')
            : Response::allow();
    }
}
