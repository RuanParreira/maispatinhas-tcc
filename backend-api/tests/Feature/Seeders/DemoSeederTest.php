<?php

use App\Enums\AdoptionStatus;
use App\Enums\PostStatus;
use App\Models\Adoption;
use App\Models\Post;
use App\Models\User;
use Database\Seeders\DemoSeeder;
use Database\Seeders\MunicipalitySeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
    $this->seed([MunicipalitySeeder::class, UserSeeder::class, DemoSeeder::class]);
});

it('creates the four accounts with the default password and a single admin', function () {
    expect(User::count())->toBe(4)
        ->and(User::all()->filter->isAdmin()->pluck('email')->all())->toBe(['admin@gmail.com'])
        ->and(User::all()->every(fn (User $user) => Hash::check('password', $user->password)))->toBeTrue();
});

it('attributes every approval to the seeded admin', function () {
    $admin = User::where('email', 'admin@gmail.com')->first();
    $approved = Post::whereNotNull('approved_at')->get();

    expect($approved)->not->toBeEmpty()
        ->and($approved->pluck('approved_by')->unique()->all())->toBe([$admin->id]);
});

it('spreads active posts across cities inside and outside a 100 km radius of Uberaba', function () {
    $cities = Post::where('status', PostStatus::Active)
        ->with('municipality')
        ->get()
        ->pluck('municipality.name')
        ->unique()
        ->sort()
        ->values()
        ->all();

    expect($cities)->toBe(['Belo Horizonte', 'Igarapava', 'Uberaba', 'Uberlândia']);
});

it('reviews every completed adoption once by each side', function () {
    $completed = Adoption::where('status', AdoptionStatus::Completed)->with('post', 'reviews')->get();

    expect($completed)->not->toBeEmpty();

    $completed->each(fn (Adoption $adoption) => expect($adoption->reviews->pluck('reviewer_id')->sort()->values()->all())
        ->toBe(collect([$adoption->post->user_id, $adoption->adopter_id])->sort()->values()->all()));

    expect(Adoption::whereNot('status', AdoptionStatus::Completed)->whereHas('reviews')->exists())->toBeFalse();
});

it('gives every regular account a donated pet and a bio', function () {
    User::where('email', '!=', 'admin@gmail.com')->get()->each(
        fn (User $user) => expect($user->bio)->not->toBeEmpty()
            ->and($user->donatedAdoptions()->where('adoptions.status', AdoptionStatus::Completed)->count())->toBe(1)
    );
});

it('stores a photo for every post and account', function () {
    expect(Post::doesntHave('files')->exists())->toBeFalse()
        ->and(User::whereNull('avatar_path')->exists())->toBeFalse();

    Post::with('files')->get()->flatMap->files->each(fn ($file) => Storage::disk('public')->assertExists($file->path));
    User::all()->each(fn (User $user) => Storage::disk('public')->assertExists($user->avatar_path));
});
