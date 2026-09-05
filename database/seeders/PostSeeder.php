<?php

namespace Database\Seeders;

use App\Enums\ModerationAction;
use App\Enums\PostStatus;
use App\Models\Animal;
use App\Models\Moderation;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Posts nos três tipos e em estados diferentes do fluxo, todos em Uberaba
     * para exercitar o filtro regional.
     */
    public function run(): void
    {
        $admin = User::where('email', UserSeeder::EMAIL_ADMIN)->firstOrFail();
        $doador = User::where('email', UserSeeder::EMAIL_DOADOR)->firstOrFail();

        $localizacao = [
            'city' => 'Uberaba',
            'state' => 'MG',
            'ibge_code' => '3170206',
        ];

        /** Publicado: aparece no catálogo e aceita solicitação de adoção. */
        $adocao = Post::factory()
            ->for($doador)
            ->for(Animal::factory()->for($doador)->create(['name' => 'Mel']))
            ->active()
            ->create([
                'title' => 'Mel procura um lar',
                'approved_by' => $admin->id,
                ...$localizacao,
            ]);

        Moderation::factory()->for($adocao)->for($admin, 'moderator')->create([
            'action' => ModerationAction::Aprovacao,
        ]);

        /** Na fila da moderação: só o autor e o moderador enxergam. */
        Post::factory()
            ->for($doador)
            ->for(Animal::factory()->for($doador)->create(['name' => 'Thor']))
            ->pending()
            ->create([
                'title' => 'Thor, dócil e vacinado',
                ...$localizacao,
            ]);

        /** Animal perdido, com data do último avistamento. */
        Post::factory()
            ->for($doador)
            ->for(Animal::factory()->for($doador)->create(['name' => 'Nina']))
            ->lost()
            ->active()
            ->create([
                'title' => 'Nina sumiu no bairro Fabrício',
                'approved_by' => $admin->id,
                ...$localizacao,
            ]);

        /** Recusado pela moderação, com o motivo registrado no log. */
        $rejeitado = Post::factory()
            ->for($doador)
            ->for(Animal::factory()->for($doador)->create(['name' => 'Bidu']))
            ->create([
                'title' => 'Bidu',
                'status' => PostStatus::Rejeitado,
                ...$localizacao,
            ]);

        Moderation::factory()->rejected()->for($rejeitado)->for($admin, 'moderator')->create([
            'reason' => 'Fotos não mostram o animal com clareza.',
        ]);
    }
}
