<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;

/**
 * Vai para o canal pessoal dos dois participantes: quem recebe vê a mensagem, e
 * quem enviou vê nas outras abas abertas. Sai na hora (sem fila), porque o
 * projeto não roda worker.
 */
class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable;

    public function __construct(public Message $message) {}

    /**
     * @return list<PrivateChannel>
     */
    public function broadcastOn(): array
    {
        $conversation = $this->message->conversation;

        return [
            new PrivateChannel("App.Models.User.{$conversation->advertiser_id}"),
            new PrivateChannel("App.Models.User.{$conversation->interested_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    /**
     * @return array{conversation_id: int, message: array{id: int, sender_id: int, body: string, read_at: null, created_at: string}}
     */
    public function broadcastWith(): array
    {
        return [
            'conversation_id' => $this->message->conversation_id,
            'message' => [
                'id' => $this->message->id,
                'sender_id' => $this->message->sender_id,
                'body' => $this->message->body,
                'read_at' => null,
                'created_at' => $this->message->created_at->toIso8601String(),
            ],
        ];
    }
}
