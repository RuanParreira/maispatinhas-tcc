<?php

use App\Models\User;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

// Stateful requests (with a session) only start when they come from the SPA.
beforeEach(fn () => $this->withHeader('Referer', config('app.frontend_url')));

it('changes the password and ends other sessions', function () {
    $user = User::factory()->create(['password' => Hash::make('old-password'), 'remember_token' => 'old-token']);
    $other = User::factory()->create();
    createSession($user, 'user-other-device');
    createSession($other, 'other-user-device');

    $this->actingAs($user)->putJson('/api/user/password', [
        'current_password' => 'old-password',
        'password' => 'new-password-123',
        'password_confirmation' => 'new-password-123',
    ])->assertNoContent();

    expect(Hash::check('new-password-123', $user->fresh()->password))->toBeTrue()
        ->and($user->fresh()->remember_token)->not->toBe('old-token')
        ->and(DB::table('sessions')->where('id', 'user-other-device')->exists())->toBeFalse()
        ->and(DB::table('sessions')->where('id', 'other-user-device')->exists())->toBeTrue();
});

it('rejects password change with wrong current password', function () {
    $user = User::factory()->create(['password' => Hash::make('old-password')]);

    $this->actingAs($user)->putJson('/api/user/password', [
        'current_password' => 'wrong-password',
        'password' => 'new-password-123',
        'password_confirmation' => 'new-password-123',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('current_password');
});

it('changes the email and requires a new verification', function () {
    Notification::fake();
    $user = User::factory()->create(['password' => Hash::make('secret-123')]);

    $this->actingAs($user)->putJson('/api/user/email', [
        'email' => 'novo@example.com',
        'current_password' => 'secret-123',
    ])->assertOk()
        ->assertJsonPath('email', 'novo@example.com');

    expect($user->fresh()->email_verified_at)->toBeNull();
    Notification::assertSentTo($user, VerifyEmailNotification::class);
});

it('rejects the current email as the new one', function () {
    $user = User::factory()->create(['password' => Hash::make('secret-123')]);

    $this->actingAs($user)->putJson('/api/user/email', [
        'email' => $user->email,
        'current_password' => 'secret-123',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors(['email' => 'O novo e-mail deve ser diferente do atual.']);
});

it('rejects an email already in use', function () {
    $user = User::factory()->create(['password' => Hash::make('secret-123')]);
    $taken = User::factory()->create();

    $this->actingAs($user)->putJson('/api/user/email', [
        'email' => $taken->email,
        'current_password' => 'secret-123',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

it('lists the user sessions without exposing their ids', function () {
    $user = User::factory()->create();
    createSession($user, 'secret-session-id');
    createSession(User::factory()->create(), 'foreign-session-id');

    $response = $this->actingAs($user)->getJson('/api/user/sessions')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.is_current', false)
        ->assertJsonPath('0.key', hash('xxh128', 'secret-session-id'));

    expect($response->getContent())->not->toContain('secret-session-id');
});

it('ends other sessions after confirming the password', function () {
    $user = User::factory()->create(['password' => Hash::make('secret-123'), 'remember_token' => 'old-token']);
    createSession($user, 'user-other-device');

    $this->actingAs($user)->deleteJson('/api/user/sessions', ['current_password' => 'wrong'])
        ->assertUnprocessable();

    $this->actingAs($user)->deleteJson('/api/user/sessions', ['current_password' => 'secret-123'])
        ->assertNoContent();

    expect(DB::table('sessions')->where('user_id', $user->id)->exists())->toBeFalse()
        ->and($user->fresh()->remember_token)->not->toBe('old-token');
});
