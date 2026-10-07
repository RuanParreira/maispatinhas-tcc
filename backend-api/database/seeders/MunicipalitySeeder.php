<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Carrega todos os municípios brasileiros (código IBGE, nome, UF e coordenadas do centro).
 *
 * Fonte: https://github.com/kelvins/municipios-brasileiros (MIT), convertida para
 * database/data/municipalities.csv com a UF como sigla de duas letras.
 */
class MunicipalitySeeder extends Seeder
{
    /**
     * Popula o banco de dados.
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
