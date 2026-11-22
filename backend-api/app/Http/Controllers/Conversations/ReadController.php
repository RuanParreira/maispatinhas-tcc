<?php

namespace App\Http\Controllers\Conversations;

use App\Events\MessagesRead;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class ReadController extends Controller
{
    /**
     * Marca como lidas as mensagens que o usuário recebeu nesta conversa e avisa
     * quem enviou. Sem nada novo para ler, não dispara aviso.
     */
    public function update(Request $request, Conversation $conversation): Response
    {
        Gate::authorize('view', $conversation);

        $user = $request->user();
        $readAt = now();

        $marked = $conversation->messages()
            ->whereNull('read_at')
            ->where('sender_id', '!=', $user->id)
            ->update(['read_at' => $readAt]);

        if ($marked > 0) {
            rescue(fn () => event(new MessagesRead($conversation->id, $conversation->otherParticipant($user)->id, $readAt)));
        }

        return response()->noContent();
    }
}
