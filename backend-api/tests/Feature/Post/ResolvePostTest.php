<?php

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withHeader('Referer', config('app.frontend_url'));
    $this->user = User::factory()->create();
});

it('resolves an active or paused lost or found post', function (string $type, PostStatus $status) {
    $post = Post::factory()->for($this->user)->$type()->create(['status' => $status]);

    $this->actingAs($this->user)->postJson("/api/my-posts/{$post->id}/resolution")->assertNoContent();

    expect($post->fresh()->status)->toBe(PostStatus::Resolved);
})->with(['lost', 'found'])->with([PostStatus::Active, PostStatus::Paused]);

it('does not resolve adoption posts, which end through the adoption confirmation', function () {
    $post = Post::factory()->for($this->user)->active()->create();

    $this->actingAs($this->user)->postJson("/api/my-posts/{$post->id}/resolution")->assertConflict();

    expect($post->fresh()->status)->toBe(PostStatus::Active);
});

it('does not resolve a post that is not published', function () {
    $post = Post::factory()->for($this->user)->lost()->create(['status' => PostStatus::PendingApproval]);

    $this->actingAs($this->user)->postJson("/api/my-posts/{$post->id}/resolution")->assertConflict();
});

it('forbids resolving someone else post', function () {
    $post = Post::factory()->lost()->active()->create();

    $this->actingAs($this->user)->postJson("/api/my-posts/{$post->id}/resolution")->assertForbidden();
});
