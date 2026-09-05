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
     * O adotador avalia o doador. Avaliador e avaliado saem da própria adoção
     * para nunca cair no CHECK que proíbe alguém avaliar a si mesmo.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'adoption_id' => Adoption::factory()->completed(),
            'reviewer_id' => fn (array $attributes) => Adoption::query()->whereKey($attributes['adoption_id'])->firstOrFail()->adopter_id,
            'reviewee_id' => fn (array $attributes) => Adoption::query()->whereKey($attributes['adoption_id'])->firstOrFail()->donor_id,
            'rating' => fake()->numberBetween(1, 5),
            'comment' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Avaliação na direção oposta: o doador avalia o adotador.
     */
    public function fromDonor(): static
    {
        return $this->state(fn (array $attributes) => [
            'reviewer_id' => fn (array $attributes) => Adoption::query()->whereKey($attributes['adoption_id'])->firstOrFail()->donor_id,
            'reviewee_id' => fn (array $attributes) => Adoption::query()->whereKey($attributes['adoption_id'])->firstOrFail()->adopter_id,
        ]);
    }
}
