<?php

namespace App\Http\Controllers\Conversations;

use App\Enums\PostStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\ConversationResource;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class ConversationController extends Controller
{
    /**
     * Conversas do usuário, da mais recente para a mais antiga. Só entram as que já
     * têm mensagem, para o anunciante não ver conversas que o interessado abriu e largou.
     * shortcut: sem paginação, paginar se alguém passar de algumas centenas de conversas.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        $conversations = Conversation::query()->involving($user)
            ->whereNotNull('last_message_at')
            ->with([...$this->relations(), 'latestMessage'])
            ->withCount(['messages as unread_count' => fn ($query) => $query
                ->whereNull('read_at')
                ->where('sender_id', '!=', $user->id)])
            ->orderByDesc('last_message_at')
            ->get();

        return ConversationResource::collection($conversations);
    }

    /**
     * Total de mensagens não lidas, para o número ao lado de "Mensagens" no menu.
     *
     * @return array{count: int}
     */
    public function unreadCount(Request $request): array
    {
        $user = $request->user();

        $count = Message::whereNull('read_at')
            ->where('sender_id', '!=', $user->id)
            ->whereHas('conversation', fn ($query) => $query->involving($user))
            ->count();

        return ['count' => $count];
    }

    public function show(Conversation $conversation): ConversationResource
    {
        Gate::authorize('view', $conversation);

        return new ConversationResource($conversation->load($this->relations()));
    }

    /**
     * Botão "Conversar" do anúncio: devolve a conversa que já existe ou cria uma.
     * O índice único (post_id, interested_id) impede duas conversas no mesmo anúncio.
     */
    public function store(Request $request, Post $post): JsonResponse
    {
        Gate::authorize('contact', $post);
        abort_unless($post->status === PostStatus::Active, 409, 'Só anúncios publicados aceitam novas conversas.');

        $conversation = Conversation::firstOrCreate(
            ['post_id' => $post->id, 'interested_id' => $request->user()->id],
            ['advertiser_id' => $post->user_id],
        );

        return (new ConversationResource($conversation->load($this->relations())))
            ->response()
            ->setStatusCode($conversation->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * Posts e animais excluídos continuam aparecendo: a conversa é histórico das duas partes.
     *
     * @return array<int|string, mixed>
     */
    private function relations(): array
    {
        return [
            'post.animal' => fn ($query) => $query->withTrashed(),
            'post.cover',
            'post.municipality:ibge_code,name,state',
            'advertiser.municipality:ibge_code,name,state',
            'interested.municipality:ibge_code,name,state',
        ];
    }
}
