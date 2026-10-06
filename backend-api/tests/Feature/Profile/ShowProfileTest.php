<?php

use App\Models\Adoption;
use App\Models\Post;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('shows the public profile with stats', function () {
    $user = User::factory()->create(['bio' => 'Protetora em Franca.']);

    Post::factory()->for($user)->active()->count(2)->create();
    Post::factory()->for($user)->pendingApproval()->create();

    $donated = Adoption::factory()->completed()->for(Post::factory()->for($user))->create();
    $trashedPost = Post::factory()->for($user)->create();
    Adoption::factory()->completed()->for($trashedPost)->create();
    $trashedPost->delete();
    Adoption::factory()->inProgress()->for(Post::factory()->for($user))->create();
    Adoption::factory()->completed()->create(['adopter_id' => $user->id]);
    Adoption::factory()->inProgress()->create(['adopter_id' => $user->id]);

    Review::factory()->create(['adoption_id' => $donated->id, 'rating' => 5]);
    Review::factory()->create(['reviewee_id' => $user->id, 'rating' => 4]);

    $this->getJson("/api/users/{$user->id}")
        ->assertOk()
        ->assertJsonPath('data.name', $user->name)
        ->assertJsonPath('data.bio', 'Protetora em Franca.')
        ->assertJsonPath('data.municipality.name', $user->municipality->name)
        ->assertJsonPath('data.stats.adoptions_completed', 3)
        ->assertJsonPath('data.stats.adoptions_donated', 2)
        ->assertJsonPath('data.stats.adoptions_adopted', 1)
        ->assertJsonPath('data.stats.active_posts', 2)
        ->assertJsonPath('data.stats.reviews_count', 2)
        ->assertJsonPath('data.stats.rating', 4.5);
});

it('never exposes contact data', function () {
    $user = User::factory()->create();

    $this->getJson("/api/users/{$user->id}")
        ->assertOk()
        ->assertJsonMissingPath('data.email')
        ->assertJsonMissingPath('data.phone');
});

it('returns null rating when the user has no reviews', function () {
    $user = User::factory()->create();

    $this->getJson("/api/users/{$user->id}")
        ->assertOk()
        ->assertJsonPath('data.stats.reviews_count', 0)
        ->assertJsonPath('data.stats.rating', null);
});

it('hides anonymized users', function () {
    $user = User::factory()->create(['anonymized_at' => now()]);

    $this->getJson("/api/users/{$user->id}")->assertNotFound();
});

it('limits profile requests per minute', function () {
    $user = User::factory()->create();

    foreach (range(1, 60) as $attempt) {
        $this->getJson("/api/users/{$user->id}")->assertOk();
    }

    $this->getJson("/api/users/{$user->id}")->assertTooManyRequests();
});
