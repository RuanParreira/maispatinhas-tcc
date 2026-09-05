<?php

namespace Database\Factories;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Animal;
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
        $user = User::factory();

        return [
            'user_id' => $user,
            'animal_id' => Animal::factory()->for($user),
            'type' => PostType::Adocao,
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'status' => PostStatus::Rascunho,
            'latitude' => fake()->latitude(-33, 5),
            'longitude' => fake()->longitude(-74, -34),
            'city' => fake()->city(),
            'state' => fake()->randomElement(['MG', 'SP', 'RJ', 'BA', 'RS']),
            'ibge_code' => fake()->numerify('#######'),
        ];
    }

    /**
     * Post publicado e visível no catálogo.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::Ativo,
            'published_at' => now(),
            'approved_by' => User::factory()->admin(),
            'approved_at' => now(),
        ]);
    }

    /**
     * Post esperando na fila da moderação.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::PendenteAprovacao,
        ]);
    }

    /**
     * Post de animal perdido, com data do último avistamento.
     */
    public function lost(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PostType::Perdido,
            'occurred_at' => fake()->dateTimeBetween('-30 days'),
        ]);
    }
}
