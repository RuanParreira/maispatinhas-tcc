<?php

use App\Enums\PostStatus;
use App\Models\Adoption;
use App\Models\Animal;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withHeader('Referer', config('app.frontend_url'));
    $this->user = User::factory()->create();
    $this->post = Post::factory()->for($this->user)->for(Animal::factory()->for($this->user))->active()->create();
});

it('cancels the post instead of deleting it, keeping the animal', function () {
    $this->actingAs($this->user)
        ->deleteJson("/api/my-posts/{$this->post->id}")
        ->assertNoContent();

    expect($this->post->fresh()->status)->toBe(PostStatus::Canceled)
        ->and($this->post->animal->fresh()->trashed())->toBeFalse();

    $this->actingAs($this->user)
        ->getJson('/api/my-posts')
        ->assertJsonPath('data.0.status', 'canceled');
});

it('forbids canceling someone else post', function () {
    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/my-posts/{$this->post->id}")
        ->assertForbidden();

    expect($this->post->fresh()->status)->toBe(PostStatus::Active);
});

it('refuses to cancel a finished post', function () {
    $this->post->forceFill(['status' => PostStatus::Resolved])->save();

    $this->actingAs($this->user)
        ->deleteJson("/api/my-posts/{$this->post->id}")
        ->assertConflict();

    expect($this->post->fresh()->status)->toBe(PostStatus::Resolved);
});

it('refuses to cancel while an adoption awaits confirmation', function () {
    Adoption::factory()->for($this->post)->inProgress()->create();

    $this->actingAs($this->user)
        ->deleteJson("/api/my-posts/{$this->post->id}")
        ->assertConflict()
        ->assertJsonPath('message', 'Há uma adoção aguardando confirmação. Desfaça a indicação antes de cancelar o anúncio.');

    expect($this->post->fresh()->status)->toBe(PostStatus::Active);
});

it('does not allow editing a canceled post', function () {
    $this->post->forceFill(['status' => PostStatus::Canceled])->save();

    $this->actingAs($this->user)
        ->patchJson("/api/my-posts/{$this->post->id}", ['title' => 'Novo título do anúncio'])
        ->assertForbidden();
});
