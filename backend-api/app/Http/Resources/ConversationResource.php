<?php

namespace App\Http\Resources;

use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Conversa vista por um dos participantes: other_user é sempre a outra pessoa,
 * e can_send diz se o campo de mensagem fica liberado.
 *
 * @mixin Conversation
 */
class ConversationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $otherUser = $this->otherParticipant($user);

        return [
            'id' => $this->id,
            'status' => $this->status,
            'can_send' => $user->can('send', $this->resource),
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            'unread_count' => $this->whenCounted('unread_count'),
            'last_message' => new MessageResource($this->whenLoaded('latestMessage')),
            'other_user' => [
                ...(new UserSummaryResource($otherUser))->toArray($request),
                'municipality' => $otherUser->municipality?->only(['name', 'state']),
                'member_since' => $otherUser->created_at->toIso8601String(),
            ],
            'post' => [
                'id' => $this->post->id,
                'type' => $this->post->type,
                'status' => $this->post->status,
                'title' => $this->post->title,
                'cover_url' => $this->post->cover?->url,
                'municipality' => $this->post->municipality->only(['name', 'state']),
                'animal' => [
                    'name' => $this->post->animal->name,
                    'species' => $this->post->animal->species,
                ],
            ],
        ];
    }
}
