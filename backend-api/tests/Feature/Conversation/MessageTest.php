<?php

use App\Enums\ConversationStatus;
use App\Enums\PostStatus;
use App\Enums\UserStatus;
use App\Events\MessageSent;
use App\Events\MessagesRead;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

uses(RefreshDatabase::class);

function activeConversation(): Conversation
{
    return Conversation::factory()->for(Post::factory()->active())->create();
}

it('sends a message and updates the conversation order', function () {
    $conversation = activeConversation();

    $this->actingAs($conversation->interested)
        ->postJson("/api/conversations/{$conversation->id}/messages", ['body' => 'Ele ainda está disponível?'])
        ->assertCreated()
        ->assertJsonPath('data.body', 'Ele ainda está disponível?')
        ->assertJsonPath('data.is_mine', true);

    expect($conversation->fresh()->last_message_at)->not->toBeNull();
});

it('notifies both participants in real time, so other tabs of the sender update too', function () {
    Event::fake([MessageSent::class]);
    $conversation = activeConversation();

    $this->actingAs($conversation->interested)
        ->postJson("/api/conversations/{$conversation->id}/messages", ['body' => 'Oi'])
        ->assertCreated();

    Event::assertDispatched(MessageSent::class, fn (MessageSent $event) => collect($event->broadcastOn())->pluck('name')->all() === [
        "private-App.Models.User.{$conversation->advertiser_id}",
        "private-App.Models.User.{$conversation->interested_id}",
    ] && $event->broadcastWith()['message']['sender_id'] === $conversation->interested_id);
});

it('keeps the message when the websocket server is down', function () {
    config([
        'broadcasting.default' => 'reverb',
        'broadcasting.connections.reverb.options.host' => '127.0.0.1',
        'broadcasting.connections.reverb.options.port' => 1,
        'broadcasting.connections.reverb.options.scheme' => 'http',
        'broadcasting.connections.reverb.options.useTLS' => false,
    ]);
    $conversation = activeConversation();

    $this->actingAs($conversation->interested)
        ->postJson("/api/conversations/{$conversation->id}/messages", ['body' => 'Oi'])
        ->assertCreated();

    expect($conversation->messages()->count())->toBe(1);
});

it('keeps sending on a paused post, so the parties can arrange the delivery', function () {
    $conversation = activeConversation();
    $conversation->post->forceFill(['status' => PostStatus::Paused])->save();

    $this->actingAs($conversation->advertiser)
        ->postJson("/api/conversations/{$conversation->id}/messages", ['body' => 'Pode vir amanhã.'])
        ->assertCreated();
});

it('makes the conversation read only when the post is canceled', function () {
    $conversation = activeConversation();
    $conversation->post->forceFill(['status' => PostStatus::Canceled])->save();

    $this->actingAs($conversation->interested)
        ->postJson("/api/conversations/{$conversation->id}/messages", ['body' => 'Oi'])
        ->assertForbidden();

    $this->actingAs($conversation->interested)
        ->getJson("/api/conversations/{$conversation->id}")
        ->assertOk()
        ->assertJsonPath('data.can_send', false);
});

it('does not send on an archived conversation', function () {
    $conversation = activeConversation();
    $conversation->forceFill(['status' => ConversationStatus::Archived])->save();

    $this->actingAs($conversation->interested)
        ->postJson("/api/conversations/{$conversation->id}/messages", ['body' => 'Oi'])
        ->assertForbidden();
});

it('does not let a banned user send messages', function () {
    $conversation = activeConversation();
    $conversation->interested->forceFill(['status' => UserStatus::Banned])->save();

    $this->actingAs($conversation->interested)
        ->postJson("/api/conversations/{$conversation->id}/messages", ['body' => 'Oi'])
        ->assertForbidden();
});

it('does not let someone outside the conversation read or send', function () {
    $conversation = activeConversation();
    $outsider = User::factory()->create();

    $this->actingAs($outsider)->getJson("/api/conversations/{$conversation->id}/messages")->assertNotFound();
    $this->actingAs($outsider)
        ->postJson("/api/conversations/{$conversation->id}/messages", ['body' => 'Oi'])
        ->assertNotFound();
});

it('rejects an empty or too long message', function (string $body) {
    $conversation = activeConversation();

    $this->actingAs($conversation->interested)
        ->postJson("/api/conversations/{$conversation->id}/messages", ['body' => $body])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('body');
})->with(['empty' => '', 'too long' => str_repeat('a', 2001)]);

it('lists messages from the newest', function () {
    $conversation = activeConversation();
    $older = Message::factory()->for($conversation)->create(['created_at' => now()->subMinute()]);
    $newer = Message::factory()->for($conversation)->create();

    $this->actingAs($conversation->advertiser)
        ->getJson("/api/conversations/{$conversation->id}/messages")
        ->assertOk()
        ->assertJsonPath('data.0.id', $newer->id)
        ->assertJsonPath('data.0.is_mine', false)
        ->assertJsonPath('data.1.id', $older->id);
});

it('marks as read only the messages the user received', function () {
    $conversation = activeConversation();
    $received = Message::factory()->for($conversation)->create();
    $sent = Message::factory()->for($conversation)->create(['sender_id' => $conversation->advertiser_id]);

    $this->actingAs($conversation->advertiser)
        ->putJson("/api/conversations/{$conversation->id}/read")
        ->assertNoContent();

    expect($received->fresh()->read_at)->not->toBeNull()
        ->and($sent->fresh()->read_at)->toBeNull();
});

it('tells the sender when the messages were read, only if something was unread', function () {
    Event::fake([MessagesRead::class]);
    $conversation = activeConversation();
    Message::factory()->for($conversation)->create();

    $this->actingAs($conversation->advertiser)->putJson("/api/conversations/{$conversation->id}/read");
    $this->actingAs($conversation->advertiser)->putJson("/api/conversations/{$conversation->id}/read");

    Event::assertDispatchedTimes(MessagesRead::class, 1);
    Event::assertDispatched(MessagesRead::class, fn (MessagesRead $event) => $event->senderId === $conversation->interested_id);
});

// O broadcaster null dos testes aprova qualquer canal: os canais são registrados de novo no Reverb.
it('lets only the participants join the conversation channel', function () {
    config(['broadcasting.default' => 'reverb']);
    require base_path('routes/channels.php');
    $conversation = activeConversation();
    $channel = ['socket_id' => '1234.5678', 'channel_name' => "private-conversation.{$conversation->id}"];

    $this->actingAs($conversation->interested)->postJson('/api/broadcasting/auth', $channel)->assertOk();
    $this->actingAs(User::factory()->create())->postJson('/api/broadcasting/auth', $channel)->assertForbidden();
});
