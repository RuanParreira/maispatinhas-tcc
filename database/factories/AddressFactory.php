<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
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
            'zip_code' => fake()->numerify('########'),
            'city' => fake()->city(),
            'state' => fake()->randomElement(['MG', 'SP', 'RJ', 'BA', 'RS']),
            'ibge_code' => fake()->numerify('#######'),
            'latitude' => fake()->latitude(-33, 5),
            'longitude' => fake()->longitude(-74, -34),
        ];
    }
}
