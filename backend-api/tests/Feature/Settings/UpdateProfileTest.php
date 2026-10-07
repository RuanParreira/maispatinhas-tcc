<?php

use App\Models\Municipality;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// Requisições com sessão (stateful) só começam quando vêm do SPA.
beforeEach(fn () => $this->withHeader('Referer', config('app.frontend_url')));

it('updates the profile data', function () {
    $user = User::factory()->create();
    $municipality = Municipality::factory()->create();

    $this->actingAs($user)->putJson('/api/user/profile', [
        'name' => '  Clara Mendes  ',
        'phone' => '(16) 99999-0000',
        'bio' => 'Tenho quintal telado.',
        'municipality_id' => $municipality->ibge_code,
    ])->assertOk()
        ->assertJsonPath('name', 'Clara Mendes')
        ->assertJsonPath('bio', 'Tenho quintal telado.');

    expect($user->fresh())
        ->name->toBe('Clara Mendes')
        ->phone->toBe('(16) 99999-0000')
        ->bio->toBe('Tenho quintal telado.')
        ->municipality_id->toBe($municipality->ibge_code);
});

it('clears the bio when it is sent empty', function () {
    $user = User::factory()->create(['bio' => 'Bio antiga']);

    $this->actingAs($user)->putJson('/api/user/profile', [
        'name' => $user->name,
        'phone' => $user->phone,
        'bio' => '',
        'municipality_id' => $user->municipality_id,
    ])->assertOk();

    expect($user->fresh()->bio)->toBeNull();
});

it('validates the profile data', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->putJson('/api/user/profile', [
        'name' => '',
        'phone' => '',
        'bio' => str_repeat('a', 501),
        'municipality_id' => 999999,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'phone', 'bio', 'municipality_id']);
});

it('requires authentication to update the profile', function () {
    $this->putJson('/api/user/profile', ['name' => 'Clara'])->assertUnauthorized();
});
