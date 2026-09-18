<?php

namespace Database\Factories;

use App\Enums\ModerationAction;
use App\Models\Listing;
use App\Models\Moderation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Moderation>
 */
class ModerationFactory extends Factory
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
            'moderator_id' => User::factory(),
            'action' => ModerationAction::Approval,
            'reason' => null,
        ];
    }

    /**
     * Indicate that the moderator rejected the listing.
     */
    public function rejection(): static
    {
        return $this->state(fn (array $attributes) => [
            'action' => ModerationAction::Rejection,
            'reason' => fake()->sentence(),
        ]);
    }
}
