<?php

namespace Database\Factories;

use App\Enums\ModerationAction;
use App\Models\Moderation;
use App\Models\Post;
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
            'post_id' => Post::factory(),
            'moderator_id' => User::factory()->admin(),
            'action' => ModerationAction::Aprovacao,
            'reason' => null,
        ];
    }

    /**
     * Rejeição, que sempre traz o motivo apontado ao autor.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'action' => ModerationAction::Rejeicao,
            'reason' => fake()->sentence(),
        ]);
    }
}
