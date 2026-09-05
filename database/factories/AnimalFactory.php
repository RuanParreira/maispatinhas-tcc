<?php

namespace Database\Factories;

use App\Enums\AnimalSex;
use App\Enums\AnimalSize;
use App\Enums\AnimalSpecies;
use App\Models\Animal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Animal>
 */
class AnimalFactory extends Factory
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
            'name' => fake()->firstName(),
            'species' => fake()->randomElement(AnimalSpecies::cases()),
            'breed' => fake()->optional()->word(),
            'sex' => fake()->randomElement(AnimalSex::cases()),
            'size' => fake()->randomElement(AnimalSize::cases()),
            'color' => fake()->safeColorName(),
            'distinctive_marks' => fake()->optional()->sentence(),
            'approximate_birth_date' => fake()->boolean(70)
                ? fake()->dateTimeBetween('-12 years')->format('Y-m-d')
                : null,
            'vaccinated' => fake()->boolean(),
            'dewormed' => fake()->boolean(),
            'neutered' => fake()->boolean(),
        ];
    }

    /**
     * Animal cujo histórico de saúde o doador não conhece.
     */
    public function healthUnknown(): static
    {
        return $this->state(fn (array $attributes) => [
            'vaccinated' => null,
            'dewormed' => null,
            'neutered' => null,
        ]);
    }
}
