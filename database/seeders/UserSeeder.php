<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public const EMAIL_ADMIN = 'admin@admin.com';

    public const EMAIL_DOADOR = 'doador@doador.com';

    public const EMAIL_ADOTANTE = 'adota@adota.com';

    /**
     * Senha das contas nomeadas.
     */
    private const SENHA = 'Bomdia123';

    /**
     * Conta de moderação, um doador e um adotante com endereço em Uberaba,
     * mais usuários aleatórios para o catálogo não ficar vazio.
     */
    public function run(): void
    {
        $admin = User::factory()->admin()->create([
            'name' => 'Moderador',
            'email' => self::EMAIL_ADMIN,
            'password' => self::SENHA,
        ]);

        $doador = User::factory()->create([
            'name' => 'Ana Doadora',
            'email' => self::EMAIL_DOADOR,
            'password' => self::SENHA,
        ]);

        $adotante = User::factory()->create([
            'name' => 'Bruno Adotante',
            'email' => self::EMAIL_ADOTANTE,
            'password' => self::SENHA,
        ]);

        foreach ([$admin, $doador, $adotante] as $user) {
            Address::factory()->for($user)->create([
                'city' => 'Uberaba',
                'state' => 'MG',
                'ibge_code' => '3170206',
            ]);
        }

        User::factory()->count(7)->create();
    }
}
