<?php

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// Requisições com sessão (stateful) só começam quando vêm do SPA.
beforeEach(function () {
    $this->withHeader('Referer', config('app.frontend_url'));
});

it('shows an active post to guests', function () {
    $post = Post::factory()->active()->create();

    $this->getJson("/api/posts/{$post->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $post->id)
        ->assertJsonMissingPath('data.approved_by')
        ->assertJsonMissingPath('data.user.email');
});

it('hides a post in moderation from guests and other users', function () {
    $post = Post::factory()->pendingApproval()->create();

    $this->getJson("/api/posts/{$post->id}")->assertNotFound();

    $this->actingAs(User::factory()->create())
        ->getJson("/api/posts/{$post->id}")
        ->assertNotFound();
});

it('shows a post in moderation to its owner and to admins', function () {
    $post = Post::factory()->pendingApproval()->create();

    $this->actingAs($post->user)
        ->getJson("/api/posts/{$post->id}")
        ->assertOk();

    $this->actingAs(User::factory()->admin()->create())
        ->getJson("/api/posts/{$post->id}")
        ->assertOk();
});
