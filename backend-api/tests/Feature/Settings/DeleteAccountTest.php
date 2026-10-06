<?php

use App\Enums\AdoptionStatus;
use App\Enums\ConversationStatus;
use App\Enums\PostStatus;
use App\Models\Adoption;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

// Stateful requests (with a session) only start when they come from the SPA.
beforeEach(fn () => $this->withHeader('Referer', config('app.frontend_url')));

it('requires the current password', function () {
    $user = User::factory()->create(['password' => Hash::make('secret-123')]);

    $this->actingAs($user)->deleteJson('/api/user', ['current_password' => 'wrong'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('current_password');

    expect($user->fresh()->anonymized_at)->toBeNull();
});

it('overwrites personal data and logs the user out', function () {
    $user = User::factory()->create(['password' => Hash::make('secret-123'), 'bio' => 'Bio pessoal']);
    $email = $user->email;

    $this->actingAs($user)->deleteJson('/api/user', ['current_password' => 'secret-123'])->assertNoContent();

    $user->refresh();
    expect($user->anonymized_at)->not->toBeNull()
        ->and($user->name)->toBe('Usuário removido')
        ->and($user->email)->toBe("removido-{$user->id}@anonimizado.invalid")
        ->and($user->phone)->toBeNull()
        ->and($user->bio)->toBeNull()
        ->and($user->remember_token)->toBeNull()
        ->and(Hash::check('secret-123', $user->password))->toBeFalse()
        ->and(User::where('email', $email)->exists())->toBeFalse();

    $this->assertGuest('web');
});

it('cancels open posts and keeps resolved ones', function () {
    $user = User::factory()->create(['password' => Hash::make('secret-123')]);
    $active = Post::factory()->for($user)->active()->create();
    $draft = Post::factory()->for($user)->create();
    $resolved = Post::factory()->for($user)->create(['status' => PostStatus::Resolved]);
    $foreign = Post::factory()->active()->create();

    $this->actingAs($user)->deleteJson('/api/user', ['current_password' => 'secret-123'])->assertNoContent();

    expect($active->fresh()->status)->toBe(PostStatus::Canceled)
        ->and($draft->fresh()->status)->toBe(PostStatus::Canceled)
        ->and($resolved->fresh()->status)->toBe(PostStatus::Resolved)
        ->and($foreign->fresh()->status)->toBe(PostStatus::Active);
});

it('cancels adoptions in progress on trashed posts', function () {
    $user = User::factory()->create(['password' => Hash::make('secret-123')]);
    $post = Post::factory()->for($user)->active()->create();
    $adoption = Adoption::factory()->for($post)->inProgress()->create();
    $post->delete();

    $this->actingAs($user)->deleteJson('/api/user', ['current_password' => 'secret-123'])->assertNoContent();

    expect($adoption->fresh()->status)->toBe(AdoptionStatus::Canceled);
});

it('closes adoptions on both sides', function () {
    $user = User::factory()->create(['password' => Hash::make('secret-123')]);
    $post = Post::factory()->for($user)->active()->create();
    $requestedOnPost = Adoption::factory()->for($post)->create();
    $inProgressOnPost = Adoption::factory()->for($post)->inProgress()->create();
    $ownRequest = Adoption::factory()->create(['adopter_id' => $user->id]);
    $completed = Adoption::factory()->completed()->create(['adopter_id' => $user->id]);

    $this->actingAs($user)->deleteJson('/api/user', ['current_password' => 'secret-123'])->assertNoContent();

    expect($requestedOnPost->fresh()->status)->toBe(AdoptionStatus::Refused)
        ->and($inProgressOnPost->fresh()->status)->toBe(AdoptionStatus::Canceled)
        ->and($ownRequest->fresh()->status)->toBe(AdoptionStatus::Canceled)
        ->and($completed->fresh()->status)->toBe(AdoptionStatus::Completed);
});

it('archives conversations, removes favorites and ends every session', function () {
    $user = User::factory()->create(['password' => Hash::make('secret-123')]);
    $conversation = Conversation::factory()->create(['interested_id' => $user->id]);
    $message = Message::factory()->for($conversation)->create(['sender_id' => $user->id]);
    $user->favoritePosts()->attach(Post::factory()->create());
    createSession($user, 'other-device');

    $this->actingAs($user)->deleteJson('/api/user', ['current_password' => 'secret-123'])->assertNoContent();

    expect($conversation->fresh()->status)->toBe(ConversationStatus::Archived)
        ->and($message->fresh())->not->toBeNull()
        ->and(DB::table('favorites')->where('user_id', $user->id)->exists())->toBeFalse()
        ->and(DB::table('sessions')->where('user_id', $user->id)->exists())->toBeFalse();
});
