<?php

namespace App\Events;

use Carbon\CarbonInterface;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

/**
 * Avisa quem enviou que a outra pessoa leu, para o chat trocar "Enviada" por "Lida".
 * read_at limita a troca às mensagens criadas até a leitura.
 */
class MessagesRead implements ShouldBroadcastNow
{
    use Dispatchable;

    public function __construct(
        public int $conversationId,
        public int $senderId,
        public CarbonInterface $readAt,
    ) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel("App.Models.User.{$this->senderId}");
    }

    public function broadcastAs(): string
    {
        return 'messages.read';
    }

    /**
     * @return array{conversation_id: int, read_at: string}
     */
    public function broadcastWith(): array
    {
        return [
            'conversation_id' => $this->conversationId,
            'read_at' => $this->readAt->toIso8601String(),
        ];
    }
}
