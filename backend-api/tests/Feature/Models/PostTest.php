<?php

use App\Enums\PostStatus;
use App\Models\Animal;
use App\Models\Municipality;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('resolves the municipality through its IBGE code', function () {
    $municipality = Municipality::factory()->create();
    $post = Post::factory()->for($municipality)->create();

    expect($post->municipality->is($municipality))->toBeTrue()
        ->and($municipality->posts->pluck('id')->all())->toBe([$post->id]);
});

it('rejects mass-assigning the owner or the animal', function () {
    $template = Post::factory()->make();

    Post::create($template->only(['user_id', 'animal_id', 'type', 'title', 'description', 'municipality_id']));
})->throws(QueryException::class);

it('starts as a draft and ignores moderation fields when mass assigned', function () {
    $user = User::factory()->create();
    $animal = Animal::factory()->for($user)->create();

    $post = new Post([
        'type' => 'adoption',
        'title' => fake()->sentence(4),
        'description' => fake()->paragraph(),
        'municipality_id' => Municipality::factory()->create()->ibge_code,
        'status' => PostStatus::Active,
        'published_at' => now(),
        'approved_at' => now(),
    ]);
    $post->user_id = $user->id;
    $post->animal_id = $animal->id;
    $post->save();
    $post = $post->fresh();

    expect($post->status)->toBe(PostStatus::Draft)
        ->and($post->published_at)->toBeNull()
        ->and($post->approved_at)->toBeNull();
});

it('rejects a municipality that does not exist', function () {
    Post::factory()->create(['municipality_id' => 1]);
})->throws(QueryException::class);
