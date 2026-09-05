<?php

namespace Database\Factories;

use App\Models\Archive;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Archive>
 */
class ArchiveFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $filename = fake()->uuid().'.jpg';

        return [
            'post_id' => Post::factory(),
            'filename' => $filename,
            'path' => 'posts/'.$filename,
            'disk' => 'public',
            'hash' => hash('sha256', Str::random()),
            'size' => fake()->numberBetween(50_000, 4_000_000),
            'content_type' => 'image/jpeg',
            'sort_order' => 0,
        ];
    }
}
