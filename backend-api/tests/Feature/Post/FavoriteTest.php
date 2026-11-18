<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('favorites and unfavorites a post without duplicating it', function () {
    $user = User::factory()->create();
    $post = Post::factory()->active()->create();

    $this->actingAs($user)->putJson("/api/posts/{$post->id}/favorite")->assertNoContent();
    $this->actingAs($user)->putJson("/api/posts/{$post->id}/favorite")->assertNoContent();

    expect($user->favoritePosts()->count())->toBe(1);

    $this->actingAs($user)->deleteJson("/api/posts/{$post->id}/favorite")->assertNoContent();

    expect($user->favoritePosts()->count())->toBe(0);
});

it('does not favorite a post hidden from the user', function () {
    $post = Post::factory()->pendingApproval()->create();

    $this->actingAs(User::factory()->create())
        ->putJson("/api/posts/{$post->id}/favorite")
        ->assertNotFound();
});

it('does not favorite a reunion, even though it is public', function () {
    $user = User::factory()->create();
    $reunion = Post::factory()->lost()->resolved()->create();

    $this->actingAs($user)->putJson("/api/posts/{$reunion->id}/favorite")->assertConflict();

    expect($user->favoritePosts()->count())->toBe(0);
});

it('does not favorite the own post', function () {
    $post = Post::factory()->active()->create();

    $this->actingAs($post->user)->putJson("/api/posts/{$post->id}/favorite")->assertForbidden();

    expect($post->user->favoritePosts()->count())->toBe(0);
});

it('requires authentication to favorite', function () {
    $post = Post::factory()->active()->create();

    $this->putJson("/api/posts/{$post->id}/favorite")->assertUnauthorized();
    $this->getJson('/api/favorites')->assertUnauthorized();
});

it('flags favorites in the catalog only for the logged user', function () {
    $user = User::factory()->create();
    $favorite = Post::factory()->active()->create(['published_at' => now()]);
    Post::factory()->active()->create(['published_at' => now()->subDay()]);
    $user->favoritePosts()->attach($favorite);

    $this->actingAs($user)->getJson('/api/posts')
        ->assertOk()
        ->assertJsonPath('data.0.is_favorite', true)
        ->assertJsonPath('data.1.is_favorite', false);
});

it('omits the favorite flag for guests', function () {
    Post::factory()->active()->create();

    $this->getJson('/api/posts')
        ->assertOk()
        ->assertJsonMissingPath('data.0.is_favorite');
});

it('lists only the active favorites of the user', function () {
    $user = User::factory()->create();
    $active = Post::factory()->active()->create();
    $closed = Post::factory()->pendingApproval()->create();
    $user->favoritePosts()->attach([$active->id, $closed->id]);
    Post::factory()->active()->create()->favoritedBy()->attach(User::factory()->create());

    $this->actingAs($user)->getJson('/api/favorites')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $active->id)
        ->assertJsonPath('data.0.is_favorite', true);
});
