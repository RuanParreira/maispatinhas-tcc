<?php

use App\Models\Adoption;
use App\Models\Post;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('lists completed adoptions on both sides', function () {
    $user = User::factory()->create();
    $donated = Adoption::factory()->completed()->for(Post::factory()->for($user))->create(['completed_at' => now()->subDays(3)]);
    $trashedPost = Post::factory()->for($user)->create();
    Adoption::factory()->completed()->for($trashedPost)->create(['completed_at' => now()->subDays(2)]);
    $trashedPost->delete();
    $adopted = Adoption::factory()->completed()->create(['adopter_id' => $user->id, 'completed_at' => now()->subDay()]);
    Adoption::factory()->inProgress()->for(Post::factory()->for($user))->create();
    Adoption::factory()->inProgress()->create(['adopter_id' => $user->id]);
    Adoption::factory()->completed()->create();

    $this->getJson("/api/users/{$user->id}/adoptions")
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonPath('data.0.id', $adopted->id)
        ->assertJsonPath('data.0.role', 'adopter')
        ->assertJsonPath('data.0.donor.name', $adopted->post->user->name)
        ->assertJsonPath('data.1.pet.name', $trashedPost->animal->name)
        ->assertJsonPath('data.2.id', $donated->id)
        ->assertJsonPath('data.2.role', 'donor')
        ->assertJsonPath('data.2.adopter.name', $donated->adopter->name);
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
        ->assertJsonPath('data.0.reviewer_role', 'adopter')
        ->assertJsonPath('data.0.pet_name', $adoption->post->animal->name);
});

it('includes the avatar of the people listed', function () {
    $user = User::factory()->create();
    $adopter = User::factory()->create(['avatar_path' => 'avatars/adotante.webp']);
    $adoption = Adoption::factory()->completed()->for(Post::factory()->for($user))->create(['adopter_id' => $adopter->id]);
    Review::factory()->create(['adoption_id' => $adoption->id, 'reviewer_id' => $adopter->id]);
    $url = Storage::disk('public')->url('avatars/adotante.webp');

    $this->getJson("/api/users/{$user->id}/reviews")->assertJsonPath('data.0.reviewer.avatar_url', $url);
    $this->getJson("/api/users/{$user->id}/adoptions")->assertJsonPath('data.0.adopter.avatar_url', $url);
});

it('tells when the review came from the donor', function () {
    $adoption = Adoption::factory()->completed()->create();
    Review::factory()->create([
        'adoption_id' => $adoption->id,
        'reviewer_id' => $adoption->post->user_id,
        'reviewee_id' => $adoption->adopter_id,
    ]);

    $this->getJson("/api/users/{$adoption->adopter_id}/reviews")
        ->assertOk()
        ->assertJsonPath('data.0.reviewer_role', 'donor');
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
