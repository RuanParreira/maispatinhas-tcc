<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\PostFile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PostFile>
 */
class PostFileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'post_id' => Post::factory(),
            'original_name' => fake()->word().'.jpg',
            'path' => 'posts/'.fake()->uuid().'.jpg',
            'disk' => 'public',
            'hash' => hash('sha256', fake()->uuid()),
            'size' => fake()->numberBetween(50_000, 5_000_000),
            'mime_type' => 'image/jpeg',
            'position' => 0,
        ];
    }
}
