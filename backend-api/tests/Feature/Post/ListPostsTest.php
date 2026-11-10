<?php

use App\Models\Animal;
use App\Models\Municipality;
use App\Models\Post;
use App\Models\PostFile;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists only active posts with the first photo as cover', function () {
    $active = Post::factory()->active()->create();
    PostFile::factory()->for($active)->create(['path' => 'posts/second.jpg', 'position' => 1]);
    PostFile::factory()->for($active)->create(['path' => 'posts/first.jpg', 'position' => 0]);
    Post::factory()->pendingApproval()->create();

    $this->getJson('/api/posts')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $active->id)
        ->assertJsonPath('data.0.user.name', $active->user->name)
        ->assertJsonPath('data.0.animal.name', $active->animal->name)
        ->assertJsonPath('data.0.cover_url', fn (string $url) => str_ends_with($url, 'posts/first.jpg'))
        ->assertJsonStructure(['data', 'links', 'meta']);
});

it('never exposes the advertiser contact data', function () {
    Post::factory()->active()->create();

    $this->getJson('/api/posts')
        ->assertOk()
        ->assertJsonMissingPath('data.0.user.email')
        ->assertJsonMissingPath('data.0.user.phone');
});

function activePostWithAnimal(array $animal = [], array $municipality = []): Post
{
    return Post::factory()
        ->active()
        ->for(Animal::factory()->state($animal))
        ->for(Municipality::factory()->state($municipality))
        ->create();
}

it('paginates 15 posts per page and keeps the filters in the page links', function () {
    Post::factory()->active()->count(16)->create();

    $this->getJson('/api/posts?type=adoption&page=2')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('meta.total', 16)
        ->assertJsonPath('meta.last_page', 2)
        ->assertJsonPath('links.prev', fn (string $url) => str_contains($url, 'type=adoption'));
});

it('filters by species, size and sex', function () {
    $match = activePostWithAnimal(['species' => 'dog', 'size' => 'small', 'sex' => 'female']);
    activePostWithAnimal(['species' => 'cat', 'size' => 'small', 'sex' => 'female']);
    activePostWithAnimal(['species' => 'dog', 'size' => 'large', 'sex' => 'female']);
    activePostWithAnimal(['species' => 'dog', 'size' => 'small', 'sex' => 'male']);

    $this->getJson('/api/posts?species=dog&size=small&sex=female')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $match->id);
});

it('searches by animal name, breed and city name', function () {
    $byName = activePostWithAnimal(['name' => 'Thor', 'breed' => 'SRD']);
    $byBreed = activePostWithAnimal(['name' => 'Mel', 'breed' => 'Thornbury']);
    $byCity = activePostWithAnimal(['name' => 'Bob', 'breed' => 'SRD'], ['name' => 'Thorlandia']);
    activePostWithAnimal(['name' => 'Luna', 'breed' => 'SRD'], ['name' => 'Uberaba']);

    $ids = collect($this->getJson('/api/posts?search=thor')->assertOk()->json('data'))->pluck('id');

    expect($ids)->toHaveCount(3)->toContain($byName->id, $byBreed->id, $byCity->id);
});

it('filters by age group from the approximate birth date', function (string $group, string $birthDate) {
    $match = activePostWithAnimal(['approximate_birth_date' => $birthDate]);
    activePostWithAnimal(['approximate_birth_date' => $group === 'adult' ? now()->subMonths(3) : now()->subYears(4)]);

    $this->getJson("/api/posts?age_group={$group}")
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $match->id);
})->with([
    'filhote' => ['young', now()->subMonths(6)->toDateString()],
    'adulto' => ['adult', now()->subYears(4)->toDateString()],
    'idoso' => ['senior', now()->subYears(9)->toDateString()],
]);

it('sorts by animal name when asked', function () {
    activePostWithAnimal(['name' => 'Zeca']);
    activePostWithAnimal(['name' => 'Amora']);

    $this->getJson('/api/posts?sort=name')
        ->assertOk()
        ->assertJsonPath('data.0.animal.name', 'Amora')
        ->assertJsonPath('data.1.animal.name', 'Zeca');
});

it('rejects unknown filter values', function () {
    $this->getJson('/api/posts?species=dragon&age_group=baby&sort=price')
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['species', 'age_group', 'sort']);
});

it('never exposes moderation data', function () {
    Post::factory()->active()->create();

    $this->getJson('/api/posts')
        ->assertOk()
        ->assertJsonMissingPath('data.0.approved_by')
        ->assertJsonMissingPath('data.0.status');
});
