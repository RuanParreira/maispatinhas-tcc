<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Local development accounts. Every password is "password".
 */
class UserSeeder extends Seeder
{
    public const UBERABA = 3170107;

    public const UBERLANDIA = 3170206;

    public const DELTA = 3121258;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Administrador',
            'email' => 'admin@gmail.com',
            'municipality_id' => self::UBERABA,
        ]);

        User::factory()->create([
            'name' => 'Ruan',
            'email' => 'ruan@gmail.com',
            'municipality_id' => self::UBERABA,
        ]);

        User::factory()->create([
            'name' => 'Leandro',
            'email' => 'leandro@gmail.com',
            'municipality_id' => self::UBERLANDIA,
        ]);

        User::factory()->create([
            'name' => 'Walysson',
            'email' => 'walysson@gmail.com',
            'municipality_id' => self::DELTA,
        ]);
    }
}
