<?php

use App\Models\Post;
use App\Models\PostFile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// Requisições com sessão (stateful) só começam quando vêm do SPA.
beforeEach(function () {
    $this->withHeader('Referer', config('app.frontend_url'));
});

it('lists only the user own posts, newest first, in any status, with the cover', function () {
    $user = User::factory()->create();
    Post::factory()->for($user)->active()->create(['created_at' => now()->subDay()]);
    $pending = Post::factory()->for($user)->pendingApproval()->create();
    PostFile::factory()->for($pending)->create(['path' => 'posts/capa.jpg', 'position' => 0]);
    Post::factory()->active()->create();

    $this->actingAs($user)
        ->getJson('/api/my-posts')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.status', 'pending_approval')
        ->assertJsonPath('data.0.cover_url', fn (string $url) => str_ends_with($url, 'posts/capa.jpg'));
});
