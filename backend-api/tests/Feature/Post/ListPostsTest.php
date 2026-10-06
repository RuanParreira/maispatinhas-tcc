<?php

use App\Models\Post;
use App\Models\PostFile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists only active posts with the first photo as cover', function () {
    $active = Post::factory()->active()->create();
    PostFile::factory()->for($active)->create(['path' => 'posts/second.jpg', 'position' => 1]);
    PostFile::factory()->for($active)->create(['path' => 'posts/first.jpg', 'position' => 0]);
    Post::factory()->pendingApproval()->create();

    $this->getJson('/api/posts')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $active->id)
        ->assertJsonPath('data.0.user.name', $active->user->name)
        ->assertJsonPath('data.0.animal.name', $active->animal->name)
        ->assertJsonPath('data.0.cover_url', fn (string $url) => str_ends_with($url, 'posts/first.jpg'))
        ->assertJsonStructure(['data', 'links', 'meta']);
});

it('filters posts by advertiser', function () {
    $user = User::factory()->create();
    $own = Post::factory()->for($user)->active()->create();
    Post::factory()->for($user)->pendingApproval()->create();
    Post::factory()->active()->create();

    $this->getJson("/api/posts?user={$user->id}")
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $own->id);
});

it('never exposes the advertiser contact data', function () {
    Post::factory()->active()->create();

    $this->getJson('/api/posts')
        ->assertOk()
        ->assertJsonMissingPath('data.0.user.email')
        ->assertJsonMissingPath('data.0.user.phone');
});
