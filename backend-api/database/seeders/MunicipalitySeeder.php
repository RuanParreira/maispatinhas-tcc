<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Loads all Brazilian municipalities (IBGE code, name, state and centre coordinates).
 *
 * Source: https://github.com/kelvins/municipios-brasileiros (MIT), converted to
 * database/data/municipalities.csv with the state as a two-letter code.
 */
class MunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file = new \SplFileObject(database_path('data/municipalities.csv'));
        $file->setFlags(\SplFileObject::READ_CSV | \SplFileObject::SKIP_EMPTY | \SplFileObject::READ_AHEAD);

        $rows = [];

        foreach ($file as $index => $line) {
            if ($index === 0) {
                continue;
            }

            [$ibgeCode, $name, $state, $latitude, $longitude] = $line;

            $rows[] = [
                'ibge_code' => (int) $ibgeCode,
                'name' => $name,
                'state' => $state,
                'latitude' => $latitude,
                'longitude' => $longitude,
            ];
        }

        foreach (array_chunk($rows, 500) as $chunk) {
            DB::table('municipalities')->upsert($chunk, ['ibge_code'], ['name', 'state', 'latitude', 'longitude']);
        }
    }
}
