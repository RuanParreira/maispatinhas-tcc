<?php

use App\Enums\AdoptionStatus;
use App\Models\Adoption;
use App\Models\Listing;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows several open requests for the same listing', function () {
    $listing = Listing::factory()->create();

    Adoption::factory()->for($listing)->count(2)->create();
    Adoption::factory()->for($listing)->create()->forceFill(['status' => AdoptionStatus::Refused])->save();

    expect($listing->adoptions()->count())->toBe(3);
});

it('rejects a second in-progress or completed adoption for the same listing', function (AdoptionStatus $second) {
    $listing = Listing::factory()->create();
    Adoption::factory()->for($listing)->create()->forceFill(['status' => AdoptionStatus::InProgress])->save();

    Adoption::factory()->for($listing)->create()->forceFill(['status' => $second])->save();
})->with([AdoptionStatus::InProgress, AdoptionStatus::Completed])->throws(QueryException::class);

it('hides the generated lock column from serialization', function () {
    $adoption = Adoption::factory()->create()->fresh();

    expect($adoption->toArray())->not->toHaveKey('locked_listing_id');
});
