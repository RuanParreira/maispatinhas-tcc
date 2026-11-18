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

    $this->getJson('/api/posts?type[]=adoption&page=2')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('meta.total', 16)
        ->assertJsonPath('meta.last_page', 2)
        ->assertJsonPath('links.prev', fn (string $url) => str_contains(urldecode($url), 'type[0]=adoption'));
});

it('lists lost and found posts together', function () {
    $lost = Post::factory()->lost()->active()->create();
    $found = Post::factory()->found()->active()->create();
    Post::factory()->active()->create();

    $this->getJson('/api/posts?type[]=lost&type[]=found')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.*.id', fn (array $ids) => collect($ids)->sort()->values()->all() === [$lost->id, $found->id]);
});

it('lists reunions only from resolved lost and found posts', function () {
    $reunion = Post::factory()->lost()->resolved()->create();
    Post::factory()->resolved()->create();
    Post::factory()->lost()->active()->create();

    $this->getJson('/api/posts?status=resolved')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $reunion->id)
        ->assertJsonPath('data.0.status', 'resolved');
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

// 0,45° de latitude são uns 50 km; 2,75° passam de 300 km.
function postsAroundOrigin(): array
{
    $origin = activePostWithAnimal([], ['latitude' => -19.75, 'longitude' => -47.94]);
    $close = activePostWithAnimal([], ['latitude' => -19.30, 'longitude' => -47.94]);
    $far = activePostWithAnimal([], ['latitude' => -17.00, 'longitude' => -47.94]);

    return [$origin, $close, $far];
}

it('lists only posts within the radius, nearest first, with the distance', function () {
    [$origin, $close] = postsAroundOrigin();

    $this->getJson("/api/posts?near={$origin->municipality_id}&radius=100&sort=distance")
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.id', $origin->id)
        ->assertJsonPath('data.0.distance_km', 0)
        ->assertJsonPath('data.1.id', $close->id)
        ->assertJsonPath('data.1.distance_km', 50);
});

// A -19,75° de latitude, 1° de longitude tem uns 104,8 km: 0,4772° a leste dá 50 km.
// O canto (89 km para norte e 89 km para leste) cai no quadrado de busca, mas fica a 126 km.
it('measures east-west distance and leaves out the corners of the search box', function () {
    $origin = activePostWithAnimal([], ['latitude' => -19.75, 'longitude' => -47.94]);
    $east = activePostWithAnimal([], ['latitude' => -19.75, 'longitude' => -47.4628]);
    activePostWithAnimal([], ['latitude' => -18.95, 'longitude' => -47.09]);

    $this->getJson("/api/posts?near={$origin->municipality_id}&radius=100&sort=distance")
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.1.id', $east->id)
        ->assertJsonPath('data.1.distance_km', 50);
});

it('keeps only the origin city with radius 0 and every city without a radius', function () {
    [$origin] = postsAroundOrigin();

    $this->getJson("/api/posts?near={$origin->municipality_id}&radius=0")
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $origin->id);

    $this->getJson("/api/posts?near={$origin->municipality_id}")->assertJsonCount(3, 'data');
});

it('omits the distance when no city is given', function () {
    postsAroundOrigin();

    $this->getJson('/api/posts')->assertOk()->assertJsonMissingPath('data.0.distance_km');
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

it('rejects unknown filter values', function () {
    $this->getJson('/api/posts?species=dragon&age_group=baby&sort=name&near=1&radius=-5')
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['species', 'age_group', 'sort', 'near', 'radius']);
});

it('never exposes moderation data', function () {
    Post::factory()->active()->create();

    $this->getJson('/api/posts')
        ->assertOk()
        ->assertJsonMissingPath('data.0.approved_by')
        ->assertJsonMissingPath('data.0.status');
});
