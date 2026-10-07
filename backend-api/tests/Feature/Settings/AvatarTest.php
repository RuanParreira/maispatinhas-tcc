<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

// Requisições com sessão (stateful) só começam quando vêm do SPA.
beforeEach(function () {
    $this->withHeader('Referer', config('app.frontend_url'));
    Storage::fake('public');
});

it('stores the avatar as a square webp', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/api/user/avatar', [
        'avatar' => UploadedFile::fake()->image('foto.jpg', 1200, 800),
    ], ['Accept' => 'application/json'])->assertOk();

    $path = $user->fresh()->avatar_path;

    expect($path)->toStartWith('avatars/')->toEndWith('.webp');
    Storage::disk('public')->assertExists($path);
    $response->assertJsonPath('avatar_url', Storage::disk('public')->url($path));

    $info = getimagesizefromstring(Storage::disk('public')->get($path));
    expect($info[0])->toBe(512)
        ->and($info[1])->toBe(512)
        ->and($info['mime'])->toBe('image/webp');
});

it('deletes the previous avatar when a new one is sent', function () {
    Storage::disk('public')->put('avatars/antigo.webp', 'old');
    $user = User::factory()->create(['avatar_path' => 'avatars/antigo.webp']);

    $this->actingAs($user)->post('/api/user/avatar', [
        'avatar' => UploadedFile::fake()->image('foto.png', 600, 600),
    ], ['Accept' => 'application/json'])->assertOk();

    Storage::disk('public')->assertMissing('avatars/antigo.webp');
    Storage::disk('public')->assertExists($user->fresh()->avatar_path);
});

it('rejects files that are not accepted images', function (UploadedFile $file) {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/api/user/avatar', ['avatar' => $file], ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('avatar');

    expect($user->fresh()->avatar_path)->toBeNull();
    expect(Storage::disk('public')->allFiles())->toBeEmpty();
})->with([
    'pdf' => fn () => UploadedFile::fake()->create('doc.pdf', 100, 'application/pdf'),
    'svg' => fn () => UploadedFile::fake()->createWithContent('foto.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'),
    'gif' => fn () => UploadedFile::fake()->image('foto.gif', 300, 300),
    'too small' => fn () => UploadedFile::fake()->image('foto.jpg', 64, 64),
    'too heavy' => fn () => UploadedFile::fake()->image('foto.jpg', 600, 600)->size(6 * 1024),
]);

it('requires authentication to update the avatar', function () {
    $this->post('/api/user/avatar', [
        'avatar' => UploadedFile::fake()->image('foto.jpg', 600, 600),
    ], ['Accept' => 'application/json'])->assertUnauthorized();
});

it('removes the avatar', function () {
    Storage::disk('public')->put('avatars/foto.webp', 'image');
    $user = User::factory()->create(['avatar_path' => 'avatars/foto.webp']);

    $this->actingAs($user)->deleteJson('/api/user/avatar')->assertNoContent();

    Storage::disk('public')->assertMissing('avatars/foto.webp');
    expect($user->fresh()->avatar_path)->toBeNull();
});

it('accepts removing an avatar that does not exist', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->deleteJson('/api/user/avatar')->assertNoContent();
});

it('requires authentication to remove the avatar', function () {
    $this->deleteJson('/api/user/avatar')->assertUnauthorized();
});

it('exposes the avatar url instead of the stored path', function () {
    $user = User::factory()->create(['avatar_path' => 'avatars/foto.webp']);

    $this->actingAs($user)->getJson('/api/user')
        ->assertOk()
        ->assertJsonPath('avatar_url', Storage::disk('public')->url('avatars/foto.webp'))
        ->assertJsonMissingPath('avatar_path');

    $this->getJson("/api/users/{$user->id}")
        ->assertOk()
        ->assertJsonPath('data.avatar_url', Storage::disk('public')->url('avatars/foto.webp'));
});
