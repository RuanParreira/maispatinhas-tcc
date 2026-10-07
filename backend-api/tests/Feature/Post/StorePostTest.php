<?php

use App\Enums\PostStatus;
use App\Models\Animal;
use App\Models\Municipality;
use App\Models\Post;
use App\Models\PostFile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\Laravel\Facades\Image;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withHeader('Referer', config('app.frontend_url'));
    Storage::fake('public');

    $this->user = User::factory()->create();
    $this->payload = [
        'animal_id' => Animal::factory()->create(['user_id' => $this->user->id])->id,
        'type' => 'adoption',
        'title' => 'Thor procura um lar',
        'description' => 'Dócil e vacinado.',
        'municipality_id' => Municipality::factory()->create()->ibge_code,
        'images' => [
            UploadedFile::fake()->image('capa.jpg', 800, 600),
            UploadedFile::fake()->image('lado.png', 800, 600),
        ],
    ];
});

it('stores the post pending approval with its photos in order', function () {
    $this->actingAs($this->user)
        ->post('/api/posts', $this->payload, ['Accept' => 'application/json'])
        ->assertCreated()
        ->assertJsonPath('data.status', 'pending_approval')
        ->assertJsonCount(2, 'data.photos')
        ->assertJsonMissingPath('data.photos.0.path');

    $post = Post::sole();
    expect($post->status)->toBe(PostStatus::PendingApproval)
        ->and($post->files->pluck('position')->all())->toBe([0, 1]);

    $post->files->each(fn (PostFile $file) => Storage::disk('public')->assertExists($file->path));
});

it('re-encodes photos as webp, shrunk and without metadata', function () {
    // JPEG com segmento Exif e um payload escondido depois do fim da imagem.
    $jpeg = (string) Image::decode(UploadedFile::fake()->image('foto.jpg', 3000, 2000))->encode(new JpegEncoder);
    $exif = "Exif\0\0MM\0*\0\0\0\x08\0\0\0\0\0\0";
    $jpeg = "\xFF\xD8\xFF\xE1".pack('n', strlen($exif) + 2).$exif.substr($jpeg, 2).'<?php echo "hidden"; ?>';

    $this->payload['images'] = [UploadedFile::fake()->createWithContent('foto.jpg', $jpeg)];

    $this->actingAs($this->user)
        ->post('/api/posts', $this->payload, ['Accept' => 'application/json'])
        ->assertCreated();

    $file = PostFile::sole();
    $content = Storage::disk('public')->get($file->path);
    $info = getimagesizefromstring($content);

    expect($file->path)->toStartWith("posts/{$file->post_id}/")->toEndWith('.webp')
        ->and($file->mime_type)->toBe('image/webp')
        ->and($file->size)->toBe(strlen($content))
        ->and($file->hash)->toBe(hash('sha256', $content))
        ->and($info['mime'])->toBe('image/webp')
        ->and([$info[0], $info[1]])->toBe([1600, 1067])
        ->and($content)->not->toContain('Exif')
        ->and($content)->not->toContain('hidden');
});

it('rejects photos that are not accepted images', function (UploadedFile $file) {
    $this->payload['images'] = [$file];

    $this->actingAs($this->user)
        ->post('/api/posts', $this->payload, ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('images.0');

    expect(Post::count())->toBe(0)
        ->and(Storage::disk('public')->allFiles())->toBeEmpty();
})->with([
    'pdf' => fn () => UploadedFile::fake()->create('doc.pdf', 100, 'application/pdf'),
    'svg' => fn () => UploadedFile::fake()->createWithContent('foto.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'),
    'gif' => fn () => UploadedFile::fake()->image('foto.gif', 300, 300),
    'too heavy' => fn () => UploadedFile::fake()->image('foto.jpg', 600, 600)->size(6 * 1024),
    'too small' => fn () => UploadedFile::fake()->image('foto.jpg', 299, 400),
    'too large' => fn () => UploadedFile::fake()->image('foto.jpg', 6001, 400),
]);

it('rolls back the post and deletes stored photos when saving fails', function () {
    PostFile::creating(function (PostFile $file) {
        if ($file->position === 1) {
            throw new RuntimeException('falha simulada');
        }
    });

    $this->withoutExceptionHandling();

    expect(fn () => $this->actingAs($this->user)
        ->post('/api/posts', $this->payload, ['Accept' => 'application/json']))
        ->toThrow(RuntimeException::class);

    expect(Post::count())->toBe(0)
        ->and(PostFile::count())->toBe(0)
        ->and(Storage::disk('public')->allFiles('posts'))->toBeEmpty();
});

it('rejects an animal from another user', function () {
    $this->payload['animal_id'] = Animal::factory()->create()->id;

    $this->actingAs($this->user)
        ->post('/api/posts', $this->payload, ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['animal_id' => 'Selecione um dos seus animais.']);

    expect(Post::count())->toBe(0);
});

it('rejects a deleted animal', function () {
    Animal::find($this->payload['animal_id'])->delete();

    $this->actingAs($this->user)
        ->post('/api/posts', $this->payload, ['Accept' => 'application/json'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('animal_id');

    expect(Post::count())->toBe(0);
});

it('limits post creation without blocking other sensitive routes', function () {
    $this->actingAs($this->user);

    foreach (range(1, 6) as $attempt) {
        $this->postJson('/api/posts')->assertUnprocessable();
    }

    $this->postJson('/api/posts')->assertTooManyRequests();
    $this->putJson('/api/user/password')->assertUnprocessable();
});
