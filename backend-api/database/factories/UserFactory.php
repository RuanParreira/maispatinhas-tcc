<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\Municipality;
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
     * Senha atual usada pela factory.
     */
    protected static ?string $password;

    /**
     * Estado padrão do model.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->numerify('(34) 9####-####'),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'municipality_id' => Municipality::factory(),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indica que o e-mail do usuário não foi verificado.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indica que o usuário é administrador.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => UserRole::Admin,
        ]);
    }
}
