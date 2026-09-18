<?php

use App\Models\Municipality;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('seeds only municipalities outside the local environment', function () {
    $this->seed();

    expect(Municipality::count())->toBe(5571)
        ->and(User::count())->toBe(0);
});

it('seeds the development accounts and sample data in the local environment', function () {
    app()->detectEnvironment(fn () => 'local');

    $this->seed();

    expect(User::pluck('email')->sort()->values()->all())->toBe([
        'admin@gmail.com',
        'leandro@gmail.com',
        'ruan@gmail.com',
        'walysson@gmail.com',
    ]);
});
