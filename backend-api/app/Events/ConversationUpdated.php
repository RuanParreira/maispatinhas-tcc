<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

/**
 * Avisa a outra pessoa que a conversa foi bloqueada ou desbloqueada. O aviso só
 * traz o id: o chat dela busca a conversa de novo para saber se ainda pode enviar.
 */
class ConversationUpdated implements ShouldBroadcastNow
{
    use Dispatchable;

    public function __construct(public int $conversationId, public int $recipientId) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel("App.Models.User.{$this->recipientId}");
    }

    public function broadcastAs(): string
    {
        return 'conversation.updated';
    }

    /**
     * @return array{conversation_id: int}
     */
    public function broadcastWith(): array
    {
        return ['conversation_id' => $this->conversationId];
    }
}
