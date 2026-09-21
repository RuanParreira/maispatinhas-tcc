<?php

namespace Database\Factories;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Animal;
use App\Models\Municipality;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
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
            'type' => PostType::Adoption,
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'municipality_id' => Municipality::factory(),
        ];
    }

    /**
     * Indicate that the post is about a lost animal.
     */
    public function lost(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PostType::Lost,
            'occurred_at' => fake()->dateTimeBetween('-30 days'),
        ]);
    }

    /**
     * Indicate that the post is about a found animal.
     */
    public function found(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PostType::Found,
            'occurred_at' => fake()->dateTimeBetween('-30 days'),
        ]);
    }

    /**
     * Indicate that the post is waiting for moderation.
     */
    public function pendingApproval(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::PendingApproval,
        ]);
    }

    /**
     * Indicate that the post was approved and is visible in the catalogue.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::Active,
            'approved_by' => User::factory()->admin(),
            'approved_at' => $approvedAt = fake()->dateTimeBetween('-20 days'),
            'published_at' => $approvedAt,
        ]);
    }

    /**
     * Indicate that the post was rejected by a moderator.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::Rejected,
        ]);
    }

    /**
     * Indicate that the post was approved and has since been resolved.
     */
    public function resolved(): static
    {
        return $this->active()->state(fn (array $attributes) => [
            'status' => PostStatus::Resolved,
        ]);
    }
}
