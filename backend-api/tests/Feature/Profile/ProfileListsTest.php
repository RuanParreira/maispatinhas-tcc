<?php

use App\Models\Adoption;
use App\Models\Post;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists completed adoptions where the user was the donor', function () {
    $user = User::factory()->create();
    $completed = Adoption::factory()->completed()->for(Post::factory()->for($user))->create();
    $trashedPost = Post::factory()->for($user)->create();
    Adoption::factory()->completed()->for($trashedPost)->create();
    $trashedPost->delete();
    Adoption::factory()->inProgress()->for(Post::factory()->for($user))->create();
    Adoption::factory()->completed()->create(['adopter_id' => $user->id]);

    $this->getJson("/api/users/{$user->id}/adoptions")
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonFragment(['name' => $completed->adopter->name])
        ->assertJsonFragment(['name' => $trashedPost->animal->name]);
});

it('lists reviews received with the reviewer and pet', function () {
    $user = User::factory()->create();
    $adoption = Adoption::factory()->completed()->for(Post::factory()->for($user))->create();
    $review = Review::factory()->create(['adoption_id' => $adoption->id, 'rating' => 5]);
    Review::factory()->create();

    $this->getJson("/api/users/{$user->id}/reviews")
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.rating', 5)
        ->assertJsonPath('data.0.reviewer.name', $review->reviewer->name)
        ->assertJsonPath('data.0.pet_name', $adoption->post->animal->name);
});

it('shows anonymized reviewers as removed users', function () {
    $user = User::factory()->create();
    $adoption = Adoption::factory()->completed()->for(Post::factory()->for($user))->create();
    Review::factory()->create(['adoption_id' => $adoption->id]);
    $adoption->adopter->forceFill(['name' => 'Usuário removido', 'anonymized_at' => now()])->save();

    $this->getJson("/api/users/{$user->id}/reviews")
        ->assertOk()
        ->assertJsonPath('data.0.reviewer.name', 'Usuário removido');
});

it('hides every list of anonymized users', function (string $list) {
    $user = User::factory()->create(['anonymized_at' => now()]);

    $this->getJson("/api/users/{$user->id}/{$list}")->assertNotFound();
})->with(['adoptions', 'reviews']);
