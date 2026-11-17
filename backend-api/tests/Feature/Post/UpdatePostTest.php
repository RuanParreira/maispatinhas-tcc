<?php

use App\Enums\PostStatus;
use App\Models\Animal;
use App\Models\Post;
use App\Models\PostFile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withHeader('Referer', config('app.frontend_url'));
    $this->user = User::factory()->create();
});

function ownPost(User $user, ?string $state = null): Post
{
    $factory = $state ? Post::factory()->$state() : Post::factory();

    return $factory
        ->for($user)
        ->for(Animal::factory()->for($user)->state(['name' => 'Thor']))
        ->create();
}

it('keeps the pet name required when editing a lost post', function () {
    $post = ownPost($this->user, 'lost');

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$post->id}", ['animal' => ['name' => '']], ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('animal.name');
});

it('ignores a type change when editing', function () {
    $adoption = ownPost($this->user);

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$adoption->id}", ['type' => 'lost'], ['Accept' => 'application/json'])
        ->assertOk()
        ->assertJsonPath('data.type', 'adoption');
});

it('allows clearing the approximate age only on found posts', function () {
    $found = ownPost($this->user, 'found');

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$found->id}", ['animal' => ['approximate_birth_date' => '']], ['Accept' => 'application/json'])
        ->assertOk()
        ->assertJsonPath('data.animal.birth_date', null);

    $adoption = ownPost($this->user);

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$adoption->id}", ['animal' => ['approximate_birth_date' => '']], ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('animal.approximate_birth_date');
});

it('rejects a location reference on an adoption post', function () {
    $adoption = ownPost($this->user);

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$adoption->id}", ['location_reference' => 'Centro'], ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('location_reference');
});

it('rejects a size other than small when the pet becomes a rabbit', function () {
    $post = ownPost($this->user);
    $post->animal->update(['size' => 'large']);

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$post->id}", ['animal' => ['species' => 'rabbit']], ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('animal.size');
});

it('sends an active post back to moderation when it changes', function () {
    $post = ownPost($this->user, 'active');

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$post->id}", ['title' => 'Thor continua procurando um lar'], ['Accept' => 'application/json'])
        ->assertOk()
        ->assertJsonPath('data.title', 'Thor continua procurando um lar')
        ->assertJsonPath('data.status', 'pending_approval');
});

it('removes, adds and reorders photos following photo_order', function () {
    Storage::fake('public');
    $post = ownPost($this->user);
    [$first, $second, $third] = collect(range(0, 2))
        ->map(fn (int $position) => PostFile::factory()->for($post)->create(['position' => $position]))
        ->all();

    $this->actingAs($this->user)
        ->post("/api/my-posts/{$post->id}", [
            '_method' => 'PATCH',
            'delete_photo_ids' => [$second->id],
            'images' => [UploadedFile::fake()->image('nova.jpg', 800, 600)],
            'photo_order' => ['new:0', "id:{$third->id}", "id:{$first->id}"],
        ], ['Accept' => 'application/json'])
        ->assertOk()
        ->assertJsonCount(3, 'data.photos')
        ->assertJsonPath('data.photos.1.id', $third->id)
        ->assertJsonPath('data.photos.2.id', $first->id);

    expect($post->cover()->first()->mime_type)->toBe('image/webp');
});

it('rejects a photo_order that does not match the post photos', function () {
    $post = ownPost($this->user);
    $photo = PostFile::factory()->for($post)->create();

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$post->id}", ['photo_order' => ["id:{$photo->id}", 'new:0']], ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('photo_order');
});

it('sends a paused or expired post back to moderation when it changes', function (PostStatus $status) {
    $post = ownPost($this->user, 'active');
    $post->forceFill(['status' => $status])->save();

    $this->actingAs($this->user)
        ->patch("/api/my-posts/{$post->id}", ['title' => 'Thor agora com outro texto'], ['Accept' => 'application/json'])
        ->assertOk()
        ->assertJsonPath('data.status', 'pending_approval');
})->with([PostStatus::Paused, PostStatus::Expired]);
