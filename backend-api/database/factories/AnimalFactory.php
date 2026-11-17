<?php

namespace Database\Factories;

use App\Enums\AnimalColor;
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
     * Estado padrão do model.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $species = fake()->randomElement(AnimalSpecies::cases());

        return [
            'user_id' => User::factory(),
            'name' => fake()->optional()->firstName(),
            'species' => $species,
            'breed' => 'SRD',
            'sex' => fake()->randomElement(AnimalSex::cases()),
            'size' => $species->isAlwaysSmall() ? AnimalSize::Small : fake()->randomElement(AnimalSize::cases()),
            'color' => fake()->randomElement(AnimalColor::cases()),
            'distinctive_features' => fake()->sentence(),
            'approximate_birth_date' => fake()->dateTimeBetween('-10 years', '-2 months'),
            'vaccinated' => fake()->boolean(),
            'dewormed' => fake()->boolean(),
            'neutered' => fake()->boolean(),
        ];
    }
}
