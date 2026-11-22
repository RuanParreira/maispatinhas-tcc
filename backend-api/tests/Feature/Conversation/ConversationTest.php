<?php

use App\Enums\UserStatus;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('opens a conversation once per interested person and post', function () {
    $post = Post::factory()->active()->create();
    $interested = User::factory()->create();

    $first = $this->actingAs($interested)->postJson("/api/posts/{$post->id}/conversation")
        ->assertCreated()
        ->assertJsonPath('data.other_user.id', $post->user_id)
        ->assertJsonPath('data.can_send', true);

    $this->actingAs($interested)->postJson("/api/posts/{$post->id}/conversation")
        ->assertOk()
        ->assertJsonPath('data.id', $first->json('data.id'));

    expect(Conversation::count())->toBe(1);
});

it('does not open a conversation on the own post', function () {
    $post = Post::factory()->active()->create();

    $this->actingAs($post->user)->postJson("/api/posts/{$post->id}/conversation")->assertForbidden();
});

it('does not open a conversation on a post hidden from the user', function () {
    $post = Post::factory()->pendingApproval()->create();

    $this->actingAs(User::factory()->create())
        ->postJson("/api/posts/{$post->id}/conversation")
        ->assertNotFound();
});

it('does not open a conversation on a reunion', function () {
    $reunion = Post::factory()->lost()->resolved()->create();

    $this->actingAs(User::factory()->create())
        ->postJson("/api/posts/{$reunion->id}/conversation")
        ->assertConflict();
});

it('does not let a suspended user open a conversation', function () {
    $post = Post::factory()->active()->create();
    $suspended = User::factory()->create(['status' => UserStatus::Suspended]);

    $this->actingAs($suspended)->postJson("/api/posts/{$post->id}/conversation")->assertForbidden();
});

it('lists only the user conversations that have messages, with the unread count', function () {
    $user = User::factory()->create();
    $post = Post::factory()->active()->create(['user_id' => $user->id]);

    $older = Conversation::factory()->for($post)->create(['last_message_at' => now()->subDay()]);
    Message::factory()->for($older)->count(2)->create();

    $newer = Conversation::factory()->for($post)->create(['last_message_at' => now()]);
    Message::factory()->for($newer)->create(['sender_id' => $user->id]);

    Conversation::factory()->for($post)->create();
    Conversation::factory()->for(Post::factory()->active())->create(['last_message_at' => now()]);

    $this->actingAs($user)->getJson('/api/conversations')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.id', $newer->id)
        ->assertJsonPath('data.0.unread_count', 0)
        ->assertJsonPath('data.0.last_message.is_mine', true)
        ->assertJsonPath('data.1.id', $older->id)
        ->assertJsonPath('data.1.unread_count', 2)
        ->assertJsonPath('data.1.other_user.id', $older->interested_id);
});

it('counts only unread messages the user received in his conversations', function () {
    $user = User::factory()->create();
    $conversation = Conversation::factory()->for(Post::factory()->active()->for($user))->create();
    Message::factory()->for($conversation)->count(2)->create();
    Message::factory()->for($conversation)->create(['read_at' => now()]);
    Message::factory()->for($conversation)->create(['sender_id' => $user->id]);
    Message::factory()->create();

    $this->actingAs($user)->getJson('/api/conversations/unread-count')
        ->assertOk()
        ->assertExactJson(['count' => 2]);
});

it('hides a conversation from anyone outside it', function () {
    $conversation = Conversation::factory()->for(Post::factory()->active())->create();

    $this->actingAs(User::factory()->create())
        ->getJson("/api/conversations/{$conversation->id}")
        ->assertNotFound();
});

it('requires authentication for conversations', function () {
    $this->getJson('/api/conversations')->assertUnauthorized();
});
