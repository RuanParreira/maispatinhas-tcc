<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Popula o banco de dados da aplicação.
     */
    public function run(): void
    {
        $this->call(MunicipalitySeeder::class);

        if (app()->isLocal()) {
            $this->call([UserSeeder::class, DemoSeeder::class]);
        }
    }
}
