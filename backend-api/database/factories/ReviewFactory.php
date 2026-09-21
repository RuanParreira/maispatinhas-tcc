<?php

namespace Database\Factories;

use App\Models\Adoption;
use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'adoption_id' => Adoption::factory(),
            'reviewer_id' => fn (array $attributes) => Adoption::find($attributes['adoption_id'])->adopter_id,
            'reviewee_id' => fn (array $attributes) => Adoption::find($attributes['adoption_id'])->post->user_id,
            'rating' => fake()->numberBetween(1, 5),
            'comment' => fake()->sentence(),
        ];
    }
}
