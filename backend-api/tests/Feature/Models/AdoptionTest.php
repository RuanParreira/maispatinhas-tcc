<?php

use App\Enums\AdoptionStatus;
use App\Models\Adoption;
use App\Models\Post;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows several open requests for the same post', function () {
    $post = Post::factory()->create();

    Adoption::factory()->for($post)->count(2)->create();
    Adoption::factory()->for($post)->create()->forceFill(['status' => AdoptionStatus::Refused])->save();

    expect($post->adoptions()->count())->toBe(3);
});

it('rejects a second in-progress or completed adoption for the same post', function (AdoptionStatus $second) {
    $post = Post::factory()->create();
    Adoption::factory()->for($post)->create()->forceFill(['status' => AdoptionStatus::InProgress])->save();

    Adoption::factory()->for($post)->create()->forceFill(['status' => $second])->save();
})->with([AdoptionStatus::InProgress, AdoptionStatus::Completed])->throws(QueryException::class);

it('hides the generated lock column from serialization', function () {
    $adoption = Adoption::factory()->create()->fresh();

    expect($adoption->toArray())->not->toHaveKey('locked_post_id');
});

it('derives donor and animal from the post instead of storing them', function () {
    $post = Post::factory()->create();
    $adoption = Adoption::factory()->for($post)->create()->fresh();

    expect($adoption->post->user_id)->toBe($post->user_id)
        ->and($adoption->post->animal_id)->toBe($post->animal_id)
        ->and($adoption->toArray())->not->toHaveKey('donor_id')
        ->and($adoption->toArray())->not->toHaveKey('animal_id');
});
