<?php

namespace Database\Seeders;

use App\Enums\AnimalColor;
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
use Database\Factories\PostFactory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Animais, posts, adoções e conversas de exemplo para desenvolvimento local.
 *
 * Os posts ficam espalhados por municípios reais a distâncias conhecidas de Uberaba, para
 * testar a busca por proximidade: Uberaba (0 km), Delta (30 km), Igarapava/SP (38 km),
 * Uberlândia (99 km) e Belo Horizonte (420 km, fora de um raio de 100 km).
 * As fotos ficam em database/seeders/images/posts, já em WebP, e são copiadas para o disco público.
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

        $thor = $this->animal($ruan, 'Thor', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Large, AnimalColor::Golden, 36, 'Pelagem longa e dourada, muito sociável.');
        $mia = $this->animal($ruan, 'Mia', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Brindle, 18, 'Rajada, com olhos verdes.');
        $bolinha = $this->animal($leandro, 'Bolinha', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Small, AnimalColor::Beige, 60, 'Pelo duro, orelhas caídas e coleira azul.');
        $pipoca = $this->animal($leandro, 'Pipoca', AnimalSpecies::Rabbit, AnimalSex::Female, AnimalSize::Small, AnimalColor::White, 10, null);
        $luna = $this->animal($walysson, 'Luna', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Gray, 12, 'Pelagem cinza e muito carinhosa.');
        $caramelo = $this->animal($walysson, null, AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium, AnimalColor::Caramel, 84, 'Focinho já branquinho, coleira vermelha.');
        $fred = $this->animal($walysson, 'Fred', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Large, AnimalColor::Caramel, 48, 'Mancha branca no peito e na testa.');
        $bento = $this->animal($ruan, 'Bento', AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small, AnimalColor::Orange, 24, 'Rajado, com coleira azul.');
        $mel = $this->animal($leandro, 'Mel', AnimalSpecies::Dog, AnimalSex::Female, AnimalSize::Small, AnimalColor::Golden, 4, null);
        $pacoca = $this->animal($leandro, 'Paçoca', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Orange, 30, 'Laranja com peito branco.');

        $thorPost = $this->recordApproval($this->post(Post::factory()->active(), $ruan, $thor, 'thor', [
            'municipality_id' => UserSeeder::UBERABA,
            'title' => 'Thor procura um lar',
            'description' => 'Cachorro dócil, brincalhão e acostumado com crianças. Vacinado e castrado, adora passear e se dá bem com outros cães.',
        ]));

        $this->post(Post::factory()->pendingApproval(), $ruan, $mia, 'mia', [
            'municipality_id' => UserSeeder::UBERABA,
            'title' => 'Mia para adoção responsável',
            'description' => 'Gatinha calma, castrada e vacinada. Ideal para apartamento com telas.',
        ]);

        $bolinhaPost = $this->recordApproval($this->post(Post::factory()->lost()->active(), $leandro, $bolinha, 'bolinha', [
            'municipality_id' => UserSeeder::UBERLANDIA,
            'title' => 'Bolinha desapareceu no bairro Santa Mônica',
            'description' => 'Usava coleira azul. Muito assustado com barulho, pode estar escondido em garagens. Qualquer pista ajuda!',
        ]));

        $pipocaPost = $this->post(Post::factory()->rejected(), $leandro, $pipoca, 'pipoca', [
            'municipality_id' => UserSeeder::UBERLANDIA,
            'title' => 'Coelha Pipoca',
            'description' => 'Doação.',
        ]);
        Moderation::factory()->rejection()->for($pipocaPost)->create([
            'moderator_id' => $this->admin->id,
            'reason' => 'Descrição insuficiente. Informe idade, temperamento e cuidados necessários.',
        ]);

        $this->recordApproval($this->post(Post::factory()->found()->active(), $walysson, $caramelo, 'caramelo', [
            'municipality_id' => self::IGARAPAVA,
            'title' => 'Cachorro caramelo encontrado perto da rodoviária',
            'description' => 'Está comigo em segurança. Muito manso, parece estar acostumado com casa. Procuro o tutor.',
        ]));

        $lunaPost = $this->recordApproval($this->post(Post::factory()->resolved(), $walysson, $luna, 'luna', [
            'municipality_id' => UserSeeder::DELTA,
            'title' => 'Luna, gatinha de 1 ano',
            'description' => 'Carinhosa e acostumada com apartamento.',
        ]));

        $bentoPost = $this->recordApproval($this->post(Post::factory()->resolved(), $ruan, $bento, 'bento', [
            'municipality_id' => UserSeeder::UBERABA,
            'title' => 'Bento, gato tranquilo de 2 anos',
            'description' => 'Castrado, vacinado e muito companheiro.',
        ]));

        $melPost = $this->recordApproval($this->post(Post::factory()->resolved(), $leandro, $mel, 'mel', [
            'municipality_id' => UserSeeder::UBERLANDIA,
            'title' => 'Mel, filhote de porte pequeno',
            'description' => 'Brincalhona e já sabe fazer as necessidades no lugar certo.',
        ]));

        $this->recordApproval($this->post(Post::factory()->lost()->resolved(), $leandro, $pacoca, 'pacoca', [
            'municipality_id' => UserSeeder::UBERABA,
            'title' => 'Paçoca fugiu durante os fogos de ano novo',
            'description' => 'Gata assustada, sumiu do quintal na virada. Já voltou para casa graças a um vizinho.',
        ]));

        $fredPost = $this->recordApproval($this->post(Post::factory()->active(), $walysson, $fred, 'fred', [
            'municipality_id' => self::BELO_HORIZONTE,
            'title' => 'Fred precisa de um quintal',
            'description' => 'Cachorro grande e muito ativo. Precisa de espaço para correr e de alguém que goste de passear.',
        ]));

        $this->catalog($ruan, $leandro, $walysson);

        Adoption::factory()->inProgress()->for($thorPost)->create(['adopter_id' => $leandro->id]);
        Adoption::factory()->refused()->for($thorPost)->create(['adopter_id' => $walysson->id]);
        Adoption::factory()->inProgress()->for($fredPost)->create(['adopter_id' => $ruan->id]);

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
        $this->conversation($fredPost, $ruan, [
            [$ruan, 'Oi! Tenho um quintal grande, o Fred ainda está disponível?'],
            [$walysson, 'Está sim! Posso levar ele aí no fim de semana.'],
            [$ruan, 'Combinado, fico esperando vocês.'],
        ]);
        $this->conversation($bolinhaPost, $walysson, [
            [$walysson, 'Acho que vi um cachorro parecido com o Bolinha ontem perto do shopping.'],
        ]);
    }

    /**
     * Anúncios ativos extras para a vitrine ter volume. Ficam só nas cidades já usadas
     * pelos ativos acima, para manter o cenário de distâncias.
     */
    private function catalog(User $ruan, User $leandro, User $walysson): void
    {
        $posts = [
            [Post::factory()->active(), $leandro, UserSeeder::UBERLANDIA, 'nina', 'Nina, poodle toy cheia de energia', 'Poodle de 3 anos, vacinada e castrada. Adora colo e se dá bem com crianças.',
                ['Nina', AnimalSpecies::Dog, AnimalSex::Female, AnimalSize::Small, AnimalColor::Brown, 36, 'Pelo cacheado cor de chocolate.']],
            [Post::factory()->lost()->active(), $ruan, UserSeeder::UBERABA, 'kiwi', 'Calopsita Kiwi fugiu pela janela', 'Calopsita amarela, atende pelo nome e assobia. Fugiu no fim da tarde, pode estar em alguma árvore do bairro.',
                ['Kiwi', AnimalSpecies::Bird, AnimalSex::Male, AnimalSize::Small, AnimalColor::Other, 24, 'Amarela com bochechas laranja.']],
            [Post::factory()->active(), $walysson, self::IGARAPAVA, 'pretinha', 'Pretinha, filhote resgatada', 'Filhote de 3 meses resgatada na estrada. Já vermifugada, aguardando a segunda dose da vacina.',
                ['Pretinha', AnimalSpecies::Dog, AnimalSex::Female, AnimalSize::Medium, AnimalColor::Black, 3, 'Sobrancelhas caramelo.']],
            [Post::factory()->active(), $ruan, UserSeeder::UBERABA, 'mancha', 'Mancha, companheiro para passeios', 'Cachorro jovem, muito esperto e obediente. Anda bem na guia e adora brincar de bolinha.',
                ['Mancha', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium, AnimalColor::BlackAndWhite, 20, 'Focinho branco e peito branco.']],
            [Post::factory()->active(), $leandro, UserSeeder::UBERLANDIA, 'neve', 'Neve procura uma família carinhosa', 'Cadela dócil e tranquila, castrada e vacinada. Convive bem com gatos.',
                ['Neve', AnimalSpecies::Dog, AnimalSex::Female, AnimalSize::Medium, AnimalColor::White, 30, 'Toda branca, usa coleira vermelha.']],
            [Post::factory()->active(), $ruan, UserSeeder::UBERABA, 'simba', 'Simba, gato laranja muito dengoso', 'Gato castrado de 2 anos. Pede carinho o tempo todo e usa a caixa de areia direitinho.',
                ['Simba', AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small, AnimalColor::Orange, 24, null]],
            [Post::factory()->active(), $walysson, self::IGARAPAVA, 'tigrao', 'Tigrão para adoção', 'Gato adulto, independente e tranquilo. Ideal para quem passa o dia fora.',
                ['Tigrão', AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small, AnimalColor::Brindle, 48, 'Rajado com pintas no corpo.']],
            [Post::factory()->active(), $leandro, UserSeeder::UBERLANDIA, 'floquinho', 'Floquinho, gatinho branco de olhos azuis', 'Muito curioso e brincalhão. Vacinado, castração já agendada.',
                ['Floquinho', AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small, AnimalColor::White, 8, 'Olhos azuis.']],
            [Post::factory()->active(), $ruan, UserSeeder::UBERABA, 'amora', 'Amora, filhote de gata tricolor', 'Filhote de 2 meses, já come ração sozinha. Entrego com orientação sobre vacinas.',
                ['Amora', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Tricolor, 2, null]],
            [Post::factory()->found()->active(), $leandro, UserSeeder::UBERLANDIA, 'frajola', 'Gato frajola encontrado no Jardim Karaíba', 'Apareceu no meu quintal, é manso e parece ter dono. Está alimentado e em segurança.',
                [null, AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small, AnimalColor::BlackAndWhite, 36, 'Mancha preta no focinho.']],
            [Post::factory()->lost()->active(), $walysson, self::BELO_HORIZONTE, 'duke', 'Beagle Duke sumiu no bairro Savassi', 'Fugiu durante o passeio. Tem microchip e é muito amigável, se aproxima de qualquer pessoa.',
                ['Duke', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium, AnimalColor::Tricolor, 54, 'Coleira verde com plaquinha.']],
            [Post::factory()->found()->active(), $ruan, UserSeeder::UBERABA, 'labrador', 'Labrador preto encontrado na Praça Rui Barbosa', 'Encontrado sem coleira, muito dócil. Está comigo até achar o tutor.',
                [null, AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Large, AnimalColor::Black, 60, 'Fios brancos no queixo.']],
            [Post::factory()->active(), $walysson, self::IGARAPAVA, 'princesa', 'Princesa, gata tricolor castrada', 'Gata adulta, educada e muito limpinha. Acostumada a viver dentro de casa.',
                ['Princesa', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Tricolor, 42, 'Coleira rosa com pingente.']],
            [Post::factory()->active(), $leandro, UserSeeder::UBERLANDIA, 'toby', 'Toby, SRD de porte médio', 'Cachorro alegre e brincalhão, ótimo com crianças. Vacinado e vermifugado.',
                ['Toby', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium, AnimalColor::BlackAndWhite, 14, null]],
            [Post::factory()->active(), $ruan, UserSeeder::UBERABA, 'nala', 'Nala, gata calma e carinhosa', 'Gata de pelo claro e macio. Gosta de ambientes tranquilos e de dormir no sofá.',
                ['Nala', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Beige, 30, 'Orelhas dobradas.']],
            [Post::factory()->active(), $walysson, self::BELO_HORIZONTE, 'pingo', 'Pingo, filhote esperto', 'Filhote de 4 meses, aprende rápido e já atende pelo nome.',
                ['Pingo', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Small, AnimalColor::Black, 4, 'Patas e sobrancelhas caramelo.']],
            [Post::factory()->active(), $leandro, UserSeeder::UBERLANDIA, 'biscoito', 'Biscoito, filhote de labrador', 'Filhote dócil de 3 meses. Entrego vermifugado e com a primeira vacina.',
                ['Biscoito', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Large, AnimalColor::Beige, 3, null]],
        ];

        foreach ($posts as [$factory, $owner, $municipality, $photo, $title, $description, $animal]) {
            $this->recordApproval($this->post($factory, $owner, $this->animal($owner, ...$animal), $photo, [
                'municipality_id' => $municipality,
                'title' => $title,
                'description' => $description,
            ]));
        }
    }

    private function animal(User $owner, ?string $name, AnimalSpecies $species, AnimalSex $sex, AnimalSize $size, AnimalColor $color, int $ageInMonths, ?string $features): Animal
    {
        return Animal::factory()->for($owner)->create([
            'name' => $name,
            'species' => $species,
            'sex' => $sex,
            'size' => $size,
            'color' => $color,
            'approximate_birth_date' => now()->subMonths($ageInMonths),
            'distinctive_features' => $features,
        ]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function post(PostFactory $factory, User $owner, Animal $animal, string $photo, array $attributes): Post
    {
        $post = $factory->recycle($this->admin)->for($owner)->for($animal)->create($attributes);

        $image = file_get_contents(database_path("seeders/images/posts/{$photo}.webp"));
        $path = "posts/{$post->id}/".Str::uuid().'.webp';
        Storage::disk('public')->put($path, $image);

        $post->files()->create([
            'path' => $path,
            'disk' => 'public',
            'hash' => hash('sha256', $image),
            'size' => strlen($image),
            'mime_type' => 'image/webp',
            'position' => 0,
        ]);

        return $post;
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
