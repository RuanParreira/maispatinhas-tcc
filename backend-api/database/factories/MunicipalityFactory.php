<?php

namespace Database\Factories;

use App\Models\Municipality;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Municipality>
 */
class MunicipalityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ibge_code' => fake()->unique()->numberBetween(9000000, 9999999),
            'name' => fake()->city(),
            'state' => fake()->stateAbbr(),
            'latitude' => fake()->latitude(-33, 5),
            'longitude' => fake()->longitude(-73, -32),
        ];
    }
}
