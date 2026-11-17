<?php

use App\Enums\AdoptionStatus;
use App\Enums\PostStatus;
use App\Models\Adoption;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withHeader('Referer', config('app.frontend_url'));
    $this->adopter = User::factory()->create();
    $this->adoption = Adoption::factory()
        ->inProgress()
        ->for(Post::factory()->active())
        ->create(['adopter_id' => $this->adopter->id]);
});

it('lists pending and completed adoptions of the adopter only', function () {
    Adoption::factory()->completed()->create(['adopter_id' => $this->adopter->id]);
    Adoption::factory()->refused()->create(['adopter_id' => $this->adopter->id]);
    Adoption::factory()->completed()->create();

    $this->actingAs($this->adopter)
        ->getJson('/api/my-adoptions')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

it('completes the adoption and resolves the post when the adopter confirms', function () {
    $this->actingAs($this->adopter)
        ->postJson("/api/my-adoptions/{$this->adoption->id}/confirmation")
        ->assertNoContent();

    $adoption = $this->adoption->fresh();
    expect($adoption->status)->toBe(AdoptionStatus::Completed)
        ->and($adoption->completed_at)->not->toBeNull()
        ->and($adoption->post->status)->toBe(PostStatus::Resolved);
});

it('refuses the adoption and keeps the post active when the adopter denies', function () {
    $this->actingAs($this->adopter)
        ->deleteJson("/api/my-adoptions/{$this->adoption->id}/confirmation")
        ->assertNoContent();

    $adoption = $this->adoption->fresh();
    expect($adoption->status)->toBe(AdoptionStatus::Refused)
        ->and($adoption->post->status)->toBe(PostStatus::Active);
});

it('only answers adoptions still waiting for confirmation', function () {
    $this->adoption->forceFill(['status' => AdoptionStatus::Canceled])->save();

    $this->actingAs($this->adopter)
        ->postJson("/api/my-adoptions/{$this->adoption->id}/confirmation")
        ->assertConflict();

    expect($this->adoption->fresh()->post->status)->toBe(PostStatus::Active);
});

it('hides the adoption from anyone but the adopter', function () {
    $donor = $this->adoption->post->user;

    $this->actingAs($donor)
        ->postJson("/api/my-adoptions/{$this->adoption->id}/confirmation")
        ->assertNotFound();

    expect($this->adoption->fresh()->status)->toBe(AdoptionStatus::InProgress);
});
