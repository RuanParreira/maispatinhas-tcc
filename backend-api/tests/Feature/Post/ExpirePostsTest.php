<?php

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('expires active posts past the deadline of their type only', function () {
    $oldAdoption = Post::factory()->active()->create(['published_at' => now()->subDays(61)]);
    $recentAdoption = Post::factory()->active()->create(['published_at' => now()->subDays(40)]);
    $oldLost = Post::factory()->lost()->active()->create(['published_at' => now()->subDays(31)]);
    $oldPaused = Post::factory()->active()->create(['published_at' => now()->subDays(90)]);
    $oldPaused->forceFill(['status' => PostStatus::Paused])->save();

    $this->artisan('posts:expire')->assertSuccessful();

    expect($oldAdoption->fresh()->status)->toBe(PostStatus::Expired)
        ->and($oldLost->fresh()->status)->toBe(PostStatus::Expired)
        ->and($recentAdoption->fresh()->status)->toBe(PostStatus::Active)
        ->and($oldPaused->fresh()->status)->toBe(PostStatus::Paused);
});

it('renews an expired post back to the catalog and restarts the deadline', function () {
    $this->withHeader('Referer', config('app.frontend_url'));
    $user = User::factory()->create();
    $post = Post::factory()->for($user)->active()->create(['published_at' => now()->subDays(61)]);
    $post->forceFill(['status' => PostStatus::Expired])->save();

    $this->actingAs($user)->postJson("/api/my-posts/{$post->id}/renewal")->assertNoContent();

    $post->refresh();
    expect($post->status)->toBe(PostStatus::Active)
        ->and($post->published_at->isToday())->toBeTrue();

    $this->actingAs($user)->postJson("/api/my-posts/{$post->id}/renewal")->assertConflict();
    $this->actingAs(User::factory()->create())->postJson("/api/my-posts/{$post->id}/renewal")->assertForbidden();
});
