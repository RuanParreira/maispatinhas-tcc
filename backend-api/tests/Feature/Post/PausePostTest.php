<?php

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withHeader('Referer', config('app.frontend_url'));
    $this->user = User::factory()->create();
    $this->post = Post::factory()->for($this->user)->active()->create();
});

it('pauses an active post and resumes it without moderation', function () {
    $this->actingAs($this->user)->postJson("/api/my-posts/{$this->post->id}/pause")->assertNoContent();
    expect($this->post->fresh()->status)->toBe(PostStatus::Paused);

    $this->getJson('/api/posts')->assertJsonCount(0, 'data');

    $this->actingAs($this->user)->deleteJson("/api/my-posts/{$this->post->id}/pause")->assertNoContent();
    expect($this->post->fresh()->status)->toBe(PostStatus::Active);
});

it('only pauses active posts and only resumes paused ones', function () {
    $this->post->forceFill(['status' => PostStatus::PendingApproval])->save();

    $this->actingAs($this->user)->postJson("/api/my-posts/{$this->post->id}/pause")->assertConflict();
    $this->actingAs($this->user)->deleteJson("/api/my-posts/{$this->post->id}/pause")->assertConflict();

    expect($this->post->fresh()->status)->toBe(PostStatus::PendingApproval);
});

it('forbids pausing someone else post', function () {
    $this->actingAs(User::factory()->create())
        ->postJson("/api/my-posts/{$this->post->id}/pause")
        ->assertForbidden();
});
