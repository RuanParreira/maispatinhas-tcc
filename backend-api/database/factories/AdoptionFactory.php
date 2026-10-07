<?php

namespace Database\Factories;

use App\Enums\AdoptionStatus;
use App\Models\Adoption;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Adoption>
 */
class AdoptionFactory extends Factory
{
    /**
     * Estado padrão do model.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'post_id' => Post::factory(),
            'adopter_id' => User::factory(),
        ];
    }

    /**
     * Indica que o doador aceitou a solicitação.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AdoptionStatus::InProgress,
        ]);
    }

    /**
     * Indica que o animal foi entregue.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AdoptionStatus::Completed,
            'completed_at' => fake()->dateTimeBetween('-10 days'),
        ]);
    }

    /**
     * Indica que o doador recusou a solicitação.
     */
    public function refused(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AdoptionStatus::Refused,
        ]);
    }
}
