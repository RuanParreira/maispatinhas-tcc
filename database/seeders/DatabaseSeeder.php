<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * A ordem importa: posts dependem dos usuários, e adoções dos posts.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            PostSeeder::class,
            AdoptionSeeder::class,
        ]);
    }
}
