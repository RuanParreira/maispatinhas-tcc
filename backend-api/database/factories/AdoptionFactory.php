<?php

namespace Database\Factories;

use App\Enums\AdoptionStatus;
use App\Models\Adoption;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Adoption>
 */
class AdoptionFactory extends Factory
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
            'donor_id' => fn (array $attributes) => Listing::find($attributes['listing_id'])->user_id,
            'animal_id' => fn (array $attributes) => Listing::find($attributes['listing_id'])->animal_id,
            'adopter_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the donor accepted the request.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AdoptionStatus::InProgress,
        ]);
    }

    /**
     * Indicate that the animal was handed over.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AdoptionStatus::Completed,
            'completed_at' => fake()->dateTimeBetween('-10 days'),
        ]);
    }

    /**
     * Indicate that the donor refused the request.
     */
    public function refused(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AdoptionStatus::Refused,
        ]);
    }
}
