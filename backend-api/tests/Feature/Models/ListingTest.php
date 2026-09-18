<?php

use App\Enums\ListingStatus;
use App\Models\Listing;
use App\Models\Municipality;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('resolves the municipality through its IBGE code', function () {
    $municipality = Municipality::factory()->create();
    $listing = Listing::factory()->for($municipality)->create();

    expect($listing->municipality->is($municipality))->toBeTrue()
        ->and($municipality->listings->pluck('id')->all())->toBe([$listing->id]);
});

it('starts as a draft and ignores moderation fields when mass assigned', function () {
    $template = Listing::factory()->make();

    $listing = Listing::create([
        ...$template->only(['user_id', 'animal_id', 'type', 'title', 'description', 'municipality_id']),
        'status' => ListingStatus::Active,
        'published_at' => now(),
        'approved_at' => now(),
    ])->fresh();

    expect($listing->status)->toBe(ListingStatus::Draft)
        ->and($listing->published_at)->toBeNull()
        ->and($listing->approved_at)->toBeNull();
});

it('rejects a municipality that does not exist', function () {
    Listing::factory()->create(['municipality_id' => 1]);
})->throws(QueryException::class);
