<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->numerify('(##) #####-####'),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => UserRole::Usuario,
            'status' => UserStatus::Ativo,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Usuário com poder de moderação.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Admin,
        ]);
    }

    /**
     * Conta que saiu da plataforma: dado pessoal removido, linha preservada
     * para não quebrar o histórico de terceiros.
     */
    public function anonymized(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Usuário removido',
            'email' => 'anonimo-'.fake()->unique()->randomNumber(8).'@removido.local',
            'phone' => null,
            'anonymized_at' => now(),
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
