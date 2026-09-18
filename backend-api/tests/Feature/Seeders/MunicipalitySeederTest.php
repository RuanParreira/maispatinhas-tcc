<?php

use App\Models\Municipality;
use Database\Seeders\MunicipalitySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('loads every Brazilian municipality with its coordinates', function () {
    $this->seed(MunicipalitySeeder::class);

    $uberaba = Municipality::find(3170107);

    expect(Municipality::count())->toBe(5571)
        ->and($uberaba->name)->toBe('Uberaba')
        ->and($uberaba->state)->toBe('MG')
        ->and($uberaba->latitude)->toBe(-19.7472)
        ->and($uberaba->longitude)->toBe(-47.9381);
});

it('does not duplicate rows when run twice', function () {
    $this->seed(MunicipalitySeeder::class);
    $this->seed(MunicipalitySeeder::class);

    expect(Municipality::count())->toBe(5571);
});
