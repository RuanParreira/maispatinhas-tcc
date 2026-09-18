<?php

namespace Database\Factories;

use App\Enums\ListingStatus;
use App\Enums\ListingType;
use App\Models\Animal;
use App\Models\Listing;
use App\Models\Municipality;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Listing>
 */
class ListingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'animal_id' => fn (array $attributes) => Animal::factory()->create(['user_id' => $attributes['user_id']]),
            'type' => ListingType::Adoption,
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'municipality_id' => Municipality::factory(),
        ];
    }

    /**
     * Indicate that the listing is about a lost animal.
     */
    public function lost(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => ListingType::Lost,
            'occurred_at' => fake()->dateTimeBetween('-30 days'),
        ]);
    }

    /**
     * Indicate that the listing is about a found animal.
     */
    public function found(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => ListingType::Found,
            'occurred_at' => fake()->dateTimeBetween('-30 days'),
        ]);
    }

    /**
     * Indicate that the listing is waiting for moderation.
     */
    public function pendingApproval(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ListingStatus::PendingApproval,
        ]);
    }

    /**
     * Indicate that the listing was approved and is visible in the catalogue.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ListingStatus::Active,
            'approved_by' => User::factory()->admin(),
            'approved_at' => $approvedAt = fake()->dateTimeBetween('-20 days'),
            'published_at' => $approvedAt,
        ]);
    }

    /**
     * Indicate that the listing was rejected by a moderator.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ListingStatus::Rejected,
        ]);
    }

    /**
     * Indicate that the listing was approved and has since been resolved.
     */
    public function resolved(): static
    {
        return $this->active()->state(fn (array $attributes) => [
            'status' => ListingStatus::Resolved,
        ]);
    }
}
