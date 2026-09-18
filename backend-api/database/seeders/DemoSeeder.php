<?php

namespace Database\Seeders;

use App\Enums\AnimalSex;
use App\Enums\AnimalSize;
use App\Enums\AnimalSpecies;
use App\Models\Adoption;
use App\Models\Animal;
use App\Models\Conversation;
use App\Models\Listing;
use App\Models\Message;
use App\Models\Moderation;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Sample animals, listings, adoptions and chats for local development.
 *
 * Listings are spread over real municipalities at known distances from Uberaba, to exercise
 * the proximity search: Uberaba (0 km), Delta (30 km), Igarapava/SP (38 km),
 * Uberlândia (99 km) and Belo Horizonte (420 km, outside a 100 km radius).
 */
class DemoSeeder extends Seeder
{
    private const IGARAPAVA = 3520103;

    private const BELO_HORIZONTE = 3106200;

    private User $admin;

    /**
     * Run the database seeds.
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

        $thorListing = $this->recordApproval(Listing::factory()->recycle($this->admin)->active()->for($ruan)->for($thor)->create([
            'municipality_id' => UserSeeder::UBERABA,
            'title' => 'Thor procura um lar',
            'description' => 'Cachorro dócil, brincalhão e acostumado com crianças.',
        ]));

        Listing::factory()->pendingApproval()->for($ruan)->for($mia)->create([
            'municipality_id' => UserSeeder::UBERABA,
            'title' => 'Mia para adoção responsável',
            'description' => 'Gatinha calma, castrada e vacinada.',
        ]);

        $bolinhaListing = $this->recordApproval(Listing::factory()->recycle($this->admin)->lost()->active()->for($leandro)->for($bolinha)->create([
            'municipality_id' => UserSeeder::UBERLANDIA,
            'title' => 'Bolinha desapareceu no bairro Santa Mônica',
            'description' => 'Usava coleira azul. Muito assustado com barulho.',
        ]));

        $pipocaListing = Listing::factory()->rejected()->for($leandro)->for($pipoca)->create([
            'municipality_id' => UserSeeder::UBERLANDIA,
            'title' => 'Coelha Pipoca',
            'description' => 'Doação.',
        ]);
        Moderation::factory()->rejection()->for($pipocaListing)->create([
            'moderator_id' => $this->admin->id,
            'reason' => 'Descrição insuficiente. Informe idade, temperamento e cuidados necessários.',
        ]);

        $this->recordApproval(Listing::factory()->recycle($this->admin)->found()->active()->for($walysson)->for($caramelo)->create([
            'municipality_id' => self::IGARAPAVA,
            'title' => 'Cachorro caramelo encontrado perto da rodoviária',
            'description' => 'Está comigo em segurança. Procuro o tutor.',
        ]));

        $lunaListing = $this->recordApproval(Listing::factory()->recycle($this->admin)->resolved()->for($walysson)->for($luna)->create([
            'municipality_id' => UserSeeder::DELTA,
            'title' => 'Luna, gatinha de 1 ano',
            'description' => 'Carinhosa e acostumada com apartamento.',
        ]));

        $this->recordApproval(Listing::factory()->recycle($this->admin)->active()->for($walysson)->for($fred)->create([
            'municipality_id' => self::BELO_HORIZONTE,
            'title' => 'Fred precisa de um quintal',
            'description' => 'Cachorro grande e muito ativo.',
        ]));

        Adoption::factory()->inProgress()->for($thorListing)->create(['adopter_id' => $leandro->id]);
        Adoption::factory()->for($thorListing)->create(['adopter_id' => $walysson->id]);

        $lunaAdoption = Adoption::factory()->completed()->for($lunaListing)->create(['adopter_id' => $ruan->id]);
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

        $this->conversation($thorListing, $leandro, [
            [$leandro, 'Oi! O Thor ainda está disponível?'],
            [$ruan, 'Está sim! Quer marcar uma visita?'],
            [$leandro, 'Pode ser no sábado de manhã?'],
        ]);
        $this->conversation($lunaListing, $ruan, [
            [$ruan, 'Tenho interesse na Luna, moro em Uberaba.'],
            [$walysson, 'Que ótimo! Delta é pertinho, posso levar ela até você.'],
        ]);
        $this->conversation($bolinhaListing, $walysson, [
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

    private function recordApproval(Listing $listing): Listing
    {
        Moderation::factory()->for($listing)->create([
            'moderator_id' => $this->admin->id,
            'created_at' => $listing->approved_at,
        ]);

        return $listing;
    }

    /**
     * @param  list<array{0: User, 1: string}>  $messages
     */
    private function conversation(Listing $listing, User $interested, array $messages): void
    {
        $conversation = Conversation::factory()->for($listing)->create(['interested_id' => $interested->id]);

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
