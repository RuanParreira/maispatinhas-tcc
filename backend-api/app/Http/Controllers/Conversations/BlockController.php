<?php

namespace App\Http\Controllers\Conversations;

use App\Enums\ConversationStatus;
use App\Events\ConversationUpdated;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

/**
 * Bloquear deixa a conversa só para leitura nos dois lados. Só quem bloqueou desfaz.
 * A outra pessoa é avisada na hora, para o campo de mensagem dela fechar ou reabrir.
 */
class BlockController extends Controller
{
    public function store(Request $request, Conversation $conversation): Response
    {
        Gate::authorize('block', $conversation);

        $conversation->forceFill([
            'status' => ConversationStatus::Blocked,
            'blocked_by' => $request->user()->id,
        ])->save();

        $this->notifyOtherParticipant($request, $conversation);

        return response()->noContent();
    }

    public function destroy(Request $request, Conversation $conversation): Response
    {
        Gate::authorize('unblock', $conversation);

        $conversation->forceFill([
            'status' => ConversationStatus::Active,
            'blocked_by' => null,
        ])->save();

        $this->notifyOtherParticipant($request, $conversation);

        return response()->noContent();
    }

    private function notifyOtherParticipant(Request $request, Conversation $conversation): void
    {
        $recipientId = $conversation->otherParticipant($request->user())->id;

        rescue(fn () => event(new ConversationUpdated($conversation->id, $recipientId)));
    }
}
