<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\ListingFile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ListingFile>
 */
class ListingFileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'listing_id' => Listing::factory(),
            'original_name' => fake()->word().'.jpg',
            'path' => 'listings/'.fake()->uuid().'.jpg',
            'disk' => 'public',
            'hash' => hash('sha256', fake()->uuid()),
            'size' => fake()->numberBetween(50_000, 5_000_000),
            'mime_type' => 'image/jpeg',
            'position' => 0,
        ];
    }
}
