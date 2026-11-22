<?php

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

// Canal pessoal: avisa o usuário de mensagens novas e leituras em qualquer conversa dele
Broadcast::channel('App.Models.User.{id}', function (User $user, int $id) {
    return $user->id === $id;
});

// Canal da conversa: só os dois participantes trocam o aviso de "digitando..."
Broadcast::channel('conversation.{conversation}', function (User $user, Conversation $conversation) {
    return $conversation->hasParticipant($user);
});
