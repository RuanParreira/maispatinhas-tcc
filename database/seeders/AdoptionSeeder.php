<?php

namespace Database\Seeders;

use App\Enums\AdoptionStatus;
use App\Enums\PostStatus;
use App\Models\Adoption;
use App\Models\Animal;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Post;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdoptionSeeder extends Seeder
{
    /**
     * Uma adoção concluída com as duas avaliações e uma em andamento, para
     * cobrir os dois lados do fluxo descrito em "Fluxo Status de Adocao".
     */
    public function run(): void
    {
        $doador = User::where('email', UserSeeder::EMAIL_DOADOR)->firstOrFail();
        $adotante = User::where('email', UserSeeder::EMAIL_ADOTANTE)->firstOrFail();

        $this->concluida($doador, $adotante);
        $this->emAndamento($doador, $adotante);
    }

    /**
     * Adoção fechada: o post vai para `resolvido` e as duas partes se avaliam.
     */
    private function concluida(User $doador, User $adotante): void
    {
        $post = Post::where('title', 'Mel procura um lar')->firstOrFail();

        $adocao = Adoption::factory()->completed()->create([
            'post_id' => $post->id,
            'donor_id' => $doador->id,
            'animal_id' => $post->animal_id,
            'adopter_id' => $adotante->id,
        ]);

        $post->update(['status' => PostStatus::Resolvido]);

        Review::factory()->create([
            'adoption_id' => $adocao->id,
            'reviewer_id' => $adotante->id,
            'reviewee_id' => $doador->id,
            'rating' => 5,
            'comment' => 'Entrega tranquila, animal muito bem cuidado.',
        ]);

        Review::factory()->create([
            'adoption_id' => $adocao->id,
            'reviewer_id' => $doador->id,
            'reviewee_id' => $adotante->id,
            'rating' => 5,
            'comment' => 'Adotante atencioso, manda notícias da Mel toda semana.',
        ]);
    }

    /**
     * Adoção em negociação, com a conversa que a originou.
     */
    private function emAndamento(User $doador, User $adotante): void
    {
        $animal = Animal::factory()->for($doador)->create(['name' => 'Fumaça']);

        $post = Post::factory()->for($doador)->for($animal)->active()->create([
            'title' => 'Fumaça, gata tranquila',
            'approved_by' => User::where('email', UserSeeder::EMAIL_ADMIN)->value('id'),
            'city' => 'Uberaba',
            'state' => 'MG',
            'ibge_code' => '3170206',
        ]);

        $conversa = Conversation::factory()->create([
            'post_id' => $post->id,
            'advertiser_id' => $doador->id,
            'interested_id' => $adotante->id,
            'last_message_at' => now(),
        ]);

        Message::factory()->create([
            'conversation_id' => $conversa->id,
            'sender_id' => $adotante->id,
            'body' => 'Oi! A Fumaça ainda está disponível?',
            'read_at' => now(),
        ]);

        Message::factory()->create([
            'conversation_id' => $conversa->id,
            'sender_id' => $doador->id,
            'body' => 'Está sim. Pode buscar no sábado de manhã?',
        ]);

        Adoption::factory()->create([
            'post_id' => $post->id,
            'donor_id' => $doador->id,
            'animal_id' => $animal->id,
            'adopter_id' => $adotante->id,
            'status' => AdoptionStatus::EmAndamento,
            'scheduled_at' => now()->addDays(3),
        ]);
    }
}
