<?php

namespace Database\Seeders;

use App\Enums\AnimalSex;
use App\Enums\AnimalSize;
use App\Enums\AnimalSpecies;
use App\Models\Adoption;
use App\Models\Animal;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Moderation;
use App\Models\Post;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Animais, posts, adoções e conversas de exemplo para desenvolvimento local.
 *
 * Os posts ficam espalhados por municípios reais a distâncias conhecidas de Uberaba, para
 * testar a busca por proximidade: Uberaba (0 km), Delta (30 km), Igarapava/SP (38 km),
 * Uberlândia (99 km) e Belo Horizonte (420 km, fora de um raio de 100 km).
 */
class DemoSeeder extends Seeder
{
    private const IGARAPAVA = 3520103;

    private const BELO_HORIZONTE = 3106200;

    private User $admin;

    /**
     * Popula o banco de dados.
     */
    public function run(): void
    {
        $this->admin = User::where('email', 'admin@gmail.com')->firstOrFail();
        $ruan = User::where('email', 'ruan@gmail.com')->firstOrFail();
        $leandro = User::where('email', 'leandro@gmail.com')->firstOrFail();
        $walysson = User::where('email', 'walysson@gmail.com')->firstOrFail();

        $thor = $this->animal($ruan, 'Thor', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium);
        $mia = $this->animal($ruan, 'Mia', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small);
        $bolinha = $this->animal($leandro, 'Bolinha', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Small);
        $pipoca = $this->animal($leandro, 'Pipoca', AnimalSpecies::Rabbit, AnimalSex::Female, AnimalSize::Small);
        $luna = $this->animal($walysson, 'Luna', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small);
        $caramelo = $this->animal($walysson, null, AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium);
        $fred = $this->animal($walysson, 'Fred', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Large);
        $bento = $this->animal($ruan, 'Bento', AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small);
        $mel = $this->animal($leandro, 'Mel', AnimalSpecies::Dog, AnimalSex::Female, AnimalSize::Small);

        $thorPost = $this->recordApproval(Post::factory()->recycle($this->admin)->active()->for($ruan)->for($thor)->create([
            'municipality_id' => UserSeeder::UBERABA,
            'title' => 'Thor procura um lar',
            'description' => 'Cachorro dócil, brincalhão e acostumado com crianças.',
        ]));

        Post::factory()->pendingApproval()->for($ruan)->for($mia)->create([
            'municipality_id' => UserSeeder::UBERABA,
            'title' => 'Mia para adoção responsável',
            'description' => 'Gatinha calma, castrada e vacinada.',
        ]);

        $bolinhaPost = $this->recordApproval(Post::factory()->recycle($this->admin)->lost()->active()->for($leandro)->for($bolinha)->create([
            'municipality_id' => UserSeeder::UBERLANDIA,
            'title' => 'Bolinha desapareceu no bairro Santa Mônica',
            'description' => 'Usava coleira azul. Muito assustado com barulho.',
        ]));

        $pipocaPost = Post::factory()->rejected()->for($leandro)->for($pipoca)->create([
            'municipality_id' => UserSeeder::UBERLANDIA,
            'title' => 'Coelha Pipoca',
            'description' => 'Doação.',
        ]);
        Moderation::factory()->rejection()->for($pipocaPost)->create([
            'moderator_id' => $this->admin->id,
            'reason' => 'Descrição insuficiente. Informe idade, temperamento e cuidados necessários.',
        ]);

        $this->recordApproval(Post::factory()->recycle($this->admin)->found()->active()->for($walysson)->for($caramelo)->create([
            'municipality_id' => self::IGARAPAVA,
            'title' => 'Cachorro caramelo encontrado perto da rodoviária',
            'description' => 'Está comigo em segurança. Procuro o tutor.',
        ]));

        $lunaPost = $this->recordApproval(Post::factory()->recycle($this->admin)->resolved()->for($walysson)->for($luna)->create([
            'municipality_id' => UserSeeder::DELTA,
            'title' => 'Luna, gatinha de 1 ano',
            'description' => 'Carinhosa e acostumada com apartamento.',
        ]));

        $bentoPost = $this->recordApproval(Post::factory()->recycle($this->admin)->resolved()->for($ruan)->for($bento)->create([
            'municipality_id' => UserSeeder::UBERABA,
            'title' => 'Bento, gato tranquilo de 2 anos',
            'description' => 'Castrado, vacinado e muito companheiro.',
        ]));

        $melPost = $this->recordApproval(Post::factory()->recycle($this->admin)->resolved()->for($leandro)->for($mel)->create([
            'municipality_id' => UserSeeder::UBERLANDIA,
            'title' => 'Mel, filhote de porte pequeno',
            'description' => 'Brincalhona e já sabe fazer as necessidades no lugar certo.',
        ]));

        $this->recordApproval(Post::factory()->recycle($this->admin)->active()->for($walysson)->for($fred)->create([
            'municipality_id' => self::BELO_HORIZONTE,
            'title' => 'Fred precisa de um quintal',
            'description' => 'Cachorro grande e muito ativo.',
        ]));

        Adoption::factory()->inProgress()->for($thorPost)->create(['adopter_id' => $leandro->id]);
        Adoption::factory()->for($thorPost)->create(['adopter_id' => $walysson->id]);

        $lunaAdoption = Adoption::factory()->completed()->for($lunaPost)->create(['adopter_id' => $ruan->id]);
        Review::factory()->for($lunaAdoption)->create([
            'rating' => 5,
            'comment' => 'Luna chegou super bem cuidada. Walysson explicou toda a rotina dela.',
        ]);
        Review::factory()->for($lunaAdoption)->create([
            'reviewer_id' => $walysson->id,
            'reviewee_id' => $ruan->id,
            'rating' => 5,
            'comment' => 'Ruan foi muito atencioso e manda notícias da Luna.',
        ]);

        // Cada conta doou um pet, então todo perfil tem um final feliz.
        $bentoAdoption = Adoption::factory()->completed()->for($bentoPost)->create(['adopter_id' => $walysson->id]);
        Review::factory()->for($bentoAdoption)->create([
            'rating' => 4,
            'comment' => 'Bento se adaptou rápido. Ruan tirou todas as dúvidas antes da entrega.',
        ]);
        Review::factory()->for($bentoAdoption)->create([
            'reviewer_id' => $ruan->id,
            'reviewee_id' => $walysson->id,
            'rating' => 5,
            'comment' => 'Walysson preparou a casa toda para receber o Bento.',
        ]);

        $melAdoption = Adoption::factory()->completed()->for($melPost)->create(['adopter_id' => $ruan->id]);
        Review::factory()->for($melAdoption)->create([
            'rating' => 5,
            'comment' => 'A Mel veio com a carteirinha de vacinação em dia. Leandro foi muito cuidadoso.',
        ]);
        Review::factory()->for($melAdoption)->create([
            'reviewer_id' => $leandro->id,
            'reviewee_id' => $ruan->id,
            'rating' => 5,
            'comment' => 'Ruan mandou fotos da Mel na primeira semana. Adoção tranquila.',
        ]);

        $this->conversation($thorPost, $leandro, [
            [$leandro, 'Oi! O Thor ainda está disponível?'],
            [$ruan, 'Está sim! Quer marcar uma visita?'],
            [$leandro, 'Pode ser no sábado de manhã?'],
        ]);
        $this->conversation($lunaPost, $ruan, [
            [$ruan, 'Tenho interesse na Luna, moro em Uberaba.'],
            [$walysson, 'Que ótimo! Delta é pertinho, posso levar ela até você.'],
        ]);
        $this->conversation($bolinhaPost, $walysson, [
            [$walysson, 'Acho que vi um cachorro parecido com o Bolinha ontem perto do shopping.'],
        ]);
    }

    private function animal(User $owner, ?string $name, AnimalSpecies $species, AnimalSex $sex, AnimalSize $size): Animal
    {
        return Animal::factory()->for($owner)->create([
            'name' => $name,
            'species' => $species,
            'sex' => $sex,
            'size' => $size,
        ]);
    }

    private function recordApproval(Post $post): Post
    {
        Moderation::factory()->for($post)->create([
            'moderator_id' => $this->admin->id,
            'created_at' => $post->approved_at,
        ]);

        return $post;
    }

    /**
     * @param  list<array{0: User, 1: string}>  $messages
     */
    private function conversation(Post $post, User $interested, array $messages): void
    {
        $conversation = Conversation::factory()->for($post)->create(['interested_id' => $interested->id]);

        foreach ($messages as $position => [$sender, $body]) {
            $sentAt = now()->subHours(count($messages) - $position);

            Message::factory()->for($conversation)->create([
                'sender_id' => $sender->id,
                'body' => $body,
                'read_at' => $sentAt->copy()->addMinutes(5),
                'created_at' => $sentAt,
                'updated_at' => $sentAt,
            ]);
        }

        $conversation->forceFill(['last_message_at' => $conversation->messages()->max('created_at')])->save();
    }
}
