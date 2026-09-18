<?php

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Municipality;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('resolves the municipality through its IBGE code', function () {
    $municipality = Municipality::factory()->create();
    $user = User::factory()->for($municipality)->create();

    expect($user->municipality->is($municipality))->toBeTrue()
        ->and($municipality->users->pluck('id')->all())->toBe([$user->id]);
});

it('ignores role and status when mass assigned', function () {
    $user = User::create([
        'name' => 'Maria',
        'email' => 'maria@example.com',
        'phone' => '(34) 99999-0000',
        'password' => 'secret',
        'municipality_id' => Municipality::factory()->create()->ibge_code,
        'role' => 'admin',
        'status' => 'banned',
    ])->fresh();

    expect($user->role)->toBe(UserRole::User)
        ->and($user->status)->toBe(UserStatus::Active)
        ->and($user->isAdmin())->toBeFalse();
});
