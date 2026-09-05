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
     * Define the model's default state.
     *
     * `donor_id` e `animal_id` são closures para saírem do post só quando ele
     * não vier sobrescrito. Resolver o post aqui dentro com `create()` faria a
     * factory gravar um post órfão toda vez que o chamador passasse `post_id`.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'post_id' => Post::factory()->active(),
            'donor_id' => fn (array $attributes) => Post::query()->whereKey($attributes['post_id'])->firstOrFail()->user_id,
            'animal_id' => fn (array $attributes) => Post::query()->whereKey($attributes['post_id'])->firstOrFail()->animal_id,
            'adopter_id' => User::factory(),
            'status' => AdoptionStatus::Solicitada,
        ];
    }

    /**
     * Doador aceitou o pedido e as partes estão combinando a entrega.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AdoptionStatus::EmAndamento,
            'scheduled_at' => fake()->dateTimeBetween('now', '+15 days'),
        ]);
    }

    /**
     * Animal entregue. Único estado que libera avaliação.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => AdoptionStatus::Concluida,
            'scheduled_at' => fake()->dateTimeBetween('-15 days'),
        ]);
    }
}
