<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

/**
 * Avisa quem enviou que a outra pessoa leu, para o chat trocar "Enviada" por "Lida".
 */
class MessagesRead implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(public int $conversationId, public int $senderId) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel("App.Models.User.{$this->senderId}");
    }

    public function broadcastAs(): string
    {
        return 'messages.read';
    }

    /**
     * @return array{conversation_id: int}
     */
    public function broadcastWith(): array
    {
        return ['conversation_id' => $this->conversationId];
    }
}
