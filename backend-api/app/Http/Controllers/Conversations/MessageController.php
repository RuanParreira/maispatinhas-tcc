<?php

namespace App\Http\Controllers\Conversations;

use App\Http\Controllers\Controller;
use App\Http\Requests\Conversation\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class MessageController extends Controller
{
    /**
     * Mensagens da mais nova para a mais antiga; o cursor carrega as anteriores
     * conforme a pessoa rola o chat para cima.
     */
    public function index(Conversation $conversation): AnonymousResourceCollection
    {
        Gate::authorize('view', $conversation);

        $messages = $conversation->messages()
            ->latest()
            ->latest('id')
            ->cursorPaginate(30);

        return MessageResource::collection($messages);
    }

    /**
     * last_message_at ordena a lista de conversas, então muda junto com a mensagem.
     */
    public function store(StoreMessageRequest $request, Conversation $conversation): JsonResponse
    {
        Gate::authorize('send', $conversation);

        $message = DB::transaction(function () use ($request, $conversation) {
            $message = $conversation->messages()->create([
                'sender_id' => $request->user()->id,
                'body' => $request->validated('body'),
            ]);

            $conversation->last_message_at = $message->created_at;
            $conversation->save();

            return $message;
        });

        return (new MessageResource($message))->response()->setStatusCode(201);
    }
}
