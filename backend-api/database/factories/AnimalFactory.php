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
            'name' => fake()->optional()->firstName(),
            'species' => fake()->randomElement(AnimalSpecies::cases()),
            'breed' => 'SRD',
            'sex' => fake()->randomElement(AnimalSex::cases()),
            'size' => fake()->randomElement(AnimalSize::cases()),
            'color' => fake()->colorName(),
            'distinctive_features' => fake()->sentence(),
            'approximate_birth_date' => fake()->dateTimeBetween('-10 years', '-2 months'),
            'vaccinated' => fake()->boolean(),
            'dewormed' => fake()->boolean(),
            'neutered' => fake()->boolean(),
        ];
    }
}
