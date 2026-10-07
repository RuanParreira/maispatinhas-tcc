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
     * Estado padrão do model.
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
     * Indica que o post é sobre um animal perdido.
     */
    public function lost(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PostType::Lost,
            'occurred_at' => fake()->dateTimeBetween('-30 days'),
        ]);
    }

    /**
     * Indica que o post é sobre um animal encontrado.
     */
    public function found(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => PostType::Found,
            'occurred_at' => fake()->dateTimeBetween('-30 days'),
        ]);
    }

    /**
     * Indica que o post está aguardando moderação.
     */
    public function pendingApproval(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::PendingApproval,
        ]);
    }

    /**
     * Indica que o post foi aprovado e está visível no catálogo.
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
     * Indica que o post foi rejeitado por um moderador.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PostStatus::Rejected,
        ]);
    }

    /**
     * Indica que o post foi aprovado e depois resolvido.
     */
    public function resolved(): static
    {
        return $this->active()->state(fn (array $attributes) => [
            'status' => PostStatus::Resolved,
        ]);
    }
}
