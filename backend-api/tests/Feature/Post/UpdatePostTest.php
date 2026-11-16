<?php

use App\Models\Animal;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withHeader('Referer', config('app.frontend_url'));
    $this->user = User::factory()->create();
});

function ownPost(User $user, ?string $state = null): Post
{
    $factory = $state ? Post::factory()->$state() : Post::factory();

    return $factory
        ->for($user)
        ->for(Animal::factory()->for($user)->state(['name' => 'Thor']))
        ->create();
}

it('keeps the pet name required when editing a lost post', function () {
    $post = ownPost($this->user, 'lost');

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$post->id}", ['animal' => ['name' => '']], ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('animal.name');

    $adoption = ownPost($this->user);

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$adoption->id}", ['animal' => ['name' => ''], 'type' => 'lost', 'occurred_at' => now()->subDay()->toDateString()], ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('animal.name');
});

it('allows clearing the approximate age only on found posts', function () {
    $found = ownPost($this->user, 'found');

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$found->id}", ['animal' => ['approximate_birth_date' => '']], ['Accept' => 'application/json'])
        ->assertOk()
        ->assertJsonPath('data.animal.birth_date', null);

    $adoption = ownPost($this->user);

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$adoption->id}", ['animal' => ['approximate_birth_date' => '']], ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('animal.approximate_birth_date');
});
