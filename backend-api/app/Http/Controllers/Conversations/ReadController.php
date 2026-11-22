<?php

namespace App\Http\Controllers\Conversations;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class ReadController extends Controller
{
    /**
     * Marca como lidas as mensagens que o usuário recebeu nesta conversa.
     */
    public function update(Request $request, Conversation $conversation): Response
    {
        Gate::authorize('view', $conversation);

        $conversation->messages()
            ->whereNull('read_at')
            ->where('sender_id', '!=', $request->user()->id)
            ->update(['read_at' => now()]);

        return response()->noContent();
    }
}
