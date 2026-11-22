<?php

use App\Enums\ConversationStatus;
use App\Events\ConversationUpdated;
use App\Models\Conversation;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

uses(RefreshDatabase::class);

function blockableConversation(): Conversation
{
    return Conversation::factory()->for(Post::factory()->active())->create();
}

it('blocks the conversation for both sides', function () {
    $conversation = blockableConversation();

    $this->actingAs($conversation->interested)
        ->postJson("/api/conversations/{$conversation->id}/block")
        ->assertNoContent();

    expect($conversation->fresh())
        ->status->toBe(ConversationStatus::Blocked)
        ->blocked_by->toBe($conversation->interested_id);

    $this->actingAs($conversation->advertiser)
        ->getJson("/api/conversations/{$conversation->id}")
        ->assertJsonPath('data.can_send', false)
        ->assertJsonPath('data.blocked_by_me', false);

    $this->actingAs($conversation->advertiser)
        ->postJson("/api/conversations/{$conversation->id}/messages", ['body' => 'Oi'])
        ->assertForbidden();
});

it('tells the other participant when the conversation is blocked or unblocked', function () {
    Event::fake([ConversationUpdated::class]);
    $conversation = blockableConversation();

    $this->actingAs($conversation->interested)->postJson("/api/conversations/{$conversation->id}/block");
    $this->actingAs($conversation->interested)->deleteJson("/api/conversations/{$conversation->id}/block");

    Event::assertDispatchedTimes(ConversationUpdated::class, 2);
    Event::assertDispatched(ConversationUpdated::class, fn (ConversationUpdated $event) => $event->recipientId === $conversation->advertiser_id);
});

it('lets only who blocked unblock', function () {
    $conversation = blockableConversation();
    $this->actingAs($conversation->interested)->postJson("/api/conversations/{$conversation->id}/block");

    $this->actingAs($conversation->advertiser)
        ->deleteJson("/api/conversations/{$conversation->id}/block")
        ->assertForbidden();

    $this->actingAs($conversation->interested)
        ->deleteJson("/api/conversations/{$conversation->id}/block")
        ->assertNoContent();

    expect($conversation->fresh())
        ->status->toBe(ConversationStatus::Active)
        ->blocked_by->toBeNull();
});

it('does not block an archived conversation', function () {
    $conversation = blockableConversation();
    $conversation->forceFill(['status' => ConversationStatus::Archived])->save();

    $this->actingAs($conversation->interested)
        ->postJson("/api/conversations/{$conversation->id}/block")
        ->assertForbidden();
});

it('does not let someone outside the conversation block it', function () {
    $conversation = blockableConversation();

    $this->actingAs(User::factory()->create())
        ->postJson("/api/conversations/{$conversation->id}/block")
        ->assertNotFound();
});
