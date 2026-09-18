<?php

use App\Enums\AdoptionStatus;
use App\Enums\ListingStatus;
use App\Models\Adoption;
use App\Models\Listing;
use App\Models\User;
use Database\Seeders\DemoSeeder;
use Database\Seeders\MunicipalitySeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([MunicipalitySeeder::class, UserSeeder::class, DemoSeeder::class]);
});

it('creates the four accounts with the default password and a single admin', function () {
    expect(User::count())->toBe(4)
        ->and(User::all()->filter->isAdmin()->pluck('email')->all())->toBe(['admin@gmail.com'])
        ->and(User::all()->every(fn (User $user) => Hash::check('password', $user->password)))->toBeTrue();
});

it('attributes every approval to the seeded admin', function () {
    $admin = User::where('email', 'admin@gmail.com')->first();
    $approved = Listing::whereNotNull('approved_at')->get();

    expect($approved)->not->toBeEmpty()
        ->and($approved->pluck('approved_by')->unique()->all())->toBe([$admin->id]);
});

it('spreads active listings across cities inside and outside a 100 km radius of Uberaba', function () {
    $cities = Listing::where('status', ListingStatus::Active)
        ->with('municipality')
        ->get()
        ->pluck('municipality.name')
        ->sort()
        ->values()
        ->all();

    expect($cities)->toBe(['Belo Horizonte', 'Igarapava', 'Uberaba', 'Uberlândia']);
});

it('reviews only the completed adoption, once by each side', function () {
    $completed = Adoption::where('status', AdoptionStatus::Completed)->sole();

    expect($completed->reviews)->toHaveCount(2)
        ->and($completed->reviews->pluck('reviewer_id')->sort()->values()->all())
        ->toBe(collect([$completed->donor_id, $completed->adopter_id])->sort()->values()->all());
});
