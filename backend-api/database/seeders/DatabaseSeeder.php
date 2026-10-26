<?php

namespace Database\Seeders;

use App\Models\User;
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

        // O container roda migrate --seed a cada start; não repopula se já houver dados.
        if (app()->isLocal() && ! User::exists()) {
            $this->call([UserSeeder::class, DemoSeeder::class]);
        }
    }
}
