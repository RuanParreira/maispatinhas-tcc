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
 * Animais, posts, adoções, conversas e favoritos de exemplo para desenvolvimento local.
 *
 * Os posts ficam espalhados por municípios reais a distâncias conhecidas de Uberaba, para
 * testar a busca por proximidade: Uberaba (0 km), Delta (30 km), Igarapava/SP (38 km),
 * Uberlândia (99 km) e Belo Horizonte (420 km, fora de um raio de 100 km).
 * As fotos ficam em database/seeders/images/posts, já em WebP, e são copiadas para o disco público.
 */
class DemoSeeder extends Seeder
{
    private User $admin;

    /**
     * Popula o banco de dados.
     */
    public function run(): void
    {
        $this->admin = User::where('email', 'admin@gmail.com')->firstOrFail();
        [$ruan, $leandro, $walysson, $camila, $beatriz, $lucas, $juliana] = collect(['ruan', 'leandro', 'walysson', 'camila', 'beatriz', 'lucas', 'juliana'])
            ->map(fn (string $name) => User::where('email', "{$name}@gmail.com")->firstOrFail())
            ->all();

        $thor = $this->animal($ruan, 'Thor', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Large, AnimalColor::Golden, 36, 'Pelagem longa e dourada, muito sociável.');
        $mia = $this->animal($ruan, 'Mia', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Brindle, 18, 'Rajada, com olhos verdes.');
        $bolinha = $this->animal($leandro, 'Bolinha', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Small, AnimalColor::Beige, 60, 'Pelo duro, orelhas caídas e coleira azul.');
        $pipoca = $this->animal($leandro, 'Pipoca', AnimalSpecies::Rabbit, AnimalSex::Female, AnimalSize::Small, AnimalColor::White, 10, null);
        $luna = $this->animal($walysson, 'Luna', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Gray, 12, 'Pelagem cinza e muito carinhosa.');
        $caramelo = $this->animal($walysson, null, AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium, AnimalColor::Caramel, 36, 'Usa peitoral preto.');
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
            'municipality_id' => UserSeeder::IGARAPAVA,
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
            'municipality_id' => UserSeeder::BELO_HORIZONTE,
            'title' => 'Fred precisa de um quintal',
            'description' => 'Cachorro grande e muito ativo. Precisa de espaço para correr e de alguém que goste de passear.',
        ]));

        $catalog = $this->catalog($ruan, $leandro, $walysson, $camila, $beatriz, $lucas, $juliana);
        $this->reunions($camila, $beatriz, $lucas, $juliana);

        Adoption::factory()->inProgress()->for($thorPost)->create(['adopter_id' => $leandro->id]);
        Adoption::factory()->refused()->for($thorPost)->create(['adopter_id' => $walysson->id]);
        Adoption::factory()->inProgress()->for($fredPost)->create(['adopter_id' => $ruan->id]);
        Adoption::factory()->inProgress()->for($catalog['mancha'])->create(['adopter_id' => $camila->id]);
        Adoption::factory()->inProgress()->for($catalog['nina'])->create(['adopter_id' => $ruan->id]);

        // Cada conta doou um pet, então todo perfil tem um final feliz.
        $this->completedAdoption($lunaPost, $ruan, [5, 'Luna chegou super bem cuidada. Walysson explicou toda a rotina dela.'], [5, 'Ruan foi muito atencioso e manda notícias da Luna.']);
        $this->completedAdoption($bentoPost, $walysson, [4, 'Bento se adaptou rápido. Ruan tirou todas as dúvidas antes da entrega.'], [5, 'Walysson preparou a casa toda para receber o Bento.']);
        $this->completedAdoption($melPost, $ruan, [5, 'A Mel veio com a carteirinha de vacinação em dia. Leandro foi muito cuidadoso.'], [5, 'Ruan mandou fotos da Mel na primeira semana. Adoção tranquila.']);
        $this->donations($leandro, $walysson, $camila, $beatriz, $lucas, $juliana);

        $this->conversation($thorPost, $leandro, 0, 0, [
            [$leandro, 'Oi! O Thor ainda está disponível?'],
            [$ruan, 'Está sim! Quer marcar uma visita?'],
            [$leandro, 'Pode ser no sábado de manhã?'],
        ]);
        $this->conversation($catalog['simba'], $camila, 0, 2, [
            [$camila, 'Oi, Ruan! Vi o anúncio do Simba, ele se dá bem com outras gatas?'],
            [$ruan, 'Oi, Camila! Se dá sim, ele convive com a gata da minha vizinha.'],
            [$camila, 'Que ótimo! Tenho duas gatas castradas em casa.'],
            [$camila, 'Posso passar aí amanhã para conhecer ele?'],
        ]);
        $this->conversation($catalog['kiwi'], $lucas, 0, 1, [
            [$lucas, 'Boa tarde! Vi uma calopsita amarela no pé de manga perto da Praça Rui Barbosa agora há pouco.'],
        ]);
        $this->conversation($catalog['mancha'], $camila, 1, 0, [
            [$camila, 'O Mancha anda bem com coleira peitoral?'],
            [$ruan, 'Anda sim, ele já está acostumado a passear todo dia.'],
            [$camila, 'Perfeito, já fiz o pedido de adoção pelo site.'],
            [$ruan, 'Vi aqui! Vou analisar e te aviso ainda hoje.'],
        ]);
        $this->conversation($catalog['nina'], $ruan, 1, 1, [
            [$ruan, 'Oi, Leandro! A Nina ainda está disponível?'],
            [$leandro, 'Está sim! Ela é bem carinhosa, você vai gostar.'],
            [$ruan, 'Mandei o pedido de adoção. Posso buscar no fim de semana?'],
            [$leandro, 'Pode sim, só me avisa o horário que eu deixo ela pronta.'],
        ]);
        $this->conversation($catalog['labrador'], $camila, 2, 0, [
            [$camila, 'Ruan, essa cachorra parece a do meu vizinho da rua de cima.'],
            [$ruan, 'Sério? Consegue pedir para ele me chamar aqui?'],
            [$camila, 'Já mandei o link do anúncio para ele!'],
        ]);
        $this->conversation($fredPost, $ruan, 3, 0, [
            [$ruan, 'Oi! Tenho um quintal grande, o Fred ainda está disponível?'],
            [$walysson, 'Está sim! Posso levar ele aí no fim de semana.'],
            [$ruan, 'Combinado, fico esperando vocês.'],
        ]);
        $this->conversation($catalog['nala'], $beatriz, 4, 0, [
            [$beatriz, 'Oi! A Nala tem as orelhas dobradas, já fez exame de articulação?'],
            [$ruan, 'Ainda não, mas ela nunca mostrou dor.'],
            [$beatriz, 'Sou veterinária, se quiser posso dar uma olhada nela sem custo.'],
            [$ruan, 'Nossa, muito obrigado! Vou te chamar quando for a Uberlândia.'],
        ]);
        $this->conversation($lunaPost, $ruan, 6, 0, [
            [$ruan, 'Tenho interesse na Luna, moro em Uberaba.'],
            [$walysson, 'Que ótimo! Delta é pertinho, posso levar ela até você.'],
        ]);
        $this->conversation($bolinhaPost, $walysson, 1, 0, [
            [$walysson, 'Acho que vi um cachorro parecido com o Bolinha ontem perto do shopping.'],
            [$leandro, 'Sério?! Que horas mais ou menos?'],
            [$walysson, 'Umas 18h, estava perto do estacionamento.'],
        ]);
        $this->conversation($catalog['neve'], $leandro, 2, 0, [
            [$leandro, 'Beatriz, a Neve convive bem com coelho?'],
            [$beatriz, 'Nunca testei, mas ela é bem tranquila com gatos.'],
        ]);
        $this->conversation($catalog['duke'], $juliana, 0, 0, [
            [$juliana, 'Walysson, compartilhei o anúncio do Duke no grupo de protetores de BH.'],
            [$walysson, 'Muito obrigado, Juliana! Qualquer notícia me avisa.'],
        ]);

        $ruan->favoritePosts()->attach([$catalog['nina']->id, $catalog['neve']->id, $catalog['princesa']->id, $fredPost->id]);
        $camila->favoritePosts()->attach([$catalog['simba']->id, $catalog['mancha']->id, $thorPost->id]);
        $leandro->favoritePosts()->attach([$catalog['neve']->id, $catalog['tigrao']->id]);
        $beatriz->favoritePosts()->attach([$catalog['nala']->id, $catalog['floquinho']->id]);
    }

    /**
     * Anúncios ativos extras para a vitrine ter volume. Ficam só nas cidades já usadas
     * pelos ativos acima, para manter o cenário de distâncias.
     *
     * @return array<string, Post>
     */
    private function catalog(User $ruan, User $leandro, User $walysson, User $camila, User $beatriz, User $lucas, User $juliana): array
    {
        return $this->publish([
            [Post::factory()->active(), $leandro, UserSeeder::UBERLANDIA, 'nina', 'Nina, poodle toy cheia de energia', 'Poodle de 3 anos, vacinada e castrada. Adora colo e se dá bem com crianças.',
                ['Nina', AnimalSpecies::Dog, AnimalSex::Female, AnimalSize::Small, AnimalColor::Brown, 36, 'Pelo cacheado cor de chocolate.']],
            [Post::factory()->lost()->active(), $ruan, UserSeeder::UBERABA, 'kiwi', 'Calopsita Kiwi fugiu pela janela', 'Calopsita amarela, atende pelo nome e assobia. Fugiu no fim da tarde, pode estar em alguma árvore do bairro.',
                ['Kiwi', AnimalSpecies::Bird, AnimalSex::Male, AnimalSize::Small, AnimalColor::Other, 24, 'Amarela com bochechas laranja.']],
            [Post::factory()->active(), $lucas, UserSeeder::IGARAPAVA, 'pretinha', 'Pretinha, filhote resgatada', 'Filhote de 3 meses resgatada na estrada. Já vermifugada, aguardando a segunda dose da vacina.',
                ['Pretinha', AnimalSpecies::Dog, AnimalSex::Female, AnimalSize::Medium, AnimalColor::Black, 3, 'Sobrancelhas caramelo.']],
            [Post::factory()->active(), $ruan, UserSeeder::UBERABA, 'mancha', 'Mancha, companheiro para passeios', 'Cachorro jovem, muito esperto e obediente. Anda bem na guia e adora brincar de bolinha.',
                ['Mancha', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium, AnimalColor::BlackAndWhite, 20, 'Focinho branco e peito branco.']],
            [Post::factory()->active(), $beatriz, UserSeeder::UBERLANDIA, 'neve', 'Neve procura uma família carinhosa', 'Cadela dócil e tranquila, castrada e vacinada. Convive bem com gatos.',
                ['Neve', AnimalSpecies::Dog, AnimalSex::Female, AnimalSize::Medium, AnimalColor::White, 30, 'Toda branca, usa coleira vermelha.']],
            [Post::factory()->active(), $ruan, UserSeeder::UBERABA, 'simba', 'Simba, gato laranja muito dengoso', 'Gato castrado de 2 anos. Pede carinho o tempo todo e usa a caixa de areia direitinho.',
                ['Simba', AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small, AnimalColor::Orange, 24, null]],
            [Post::factory()->active(), $walysson, UserSeeder::IGARAPAVA, 'tigrao', 'Tigrão para adoção', 'Gato adulto, independente e tranquilo. Ideal para quem passa o dia fora.',
                ['Tigrão', AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small, AnimalColor::Brindle, 48, 'Rajado com pintas no corpo.']],
            [Post::factory()->active(), $beatriz, UserSeeder::UBERLANDIA, 'floquinho', 'Floquinho, gatinho branco de olhos azuis', 'Muito curioso e brincalhão. Vacinado, castração já agendada.',
                ['Floquinho', AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small, AnimalColor::White, 8, 'Olhos azuis.']],
            [Post::factory()->active(), $camila, UserSeeder::UBERABA, 'amora', 'Amora, filhote de gata tricolor', 'Filhote de 2 meses, já come ração sozinha. Entrego com orientação sobre vacinas.',
                ['Amora', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Tricolor, 2, null]],
            [Post::factory()->found()->active(), $leandro, UserSeeder::UBERLANDIA, 'frajola', 'Gato frajola encontrado no Jardim Karaíba', 'Apareceu no meu quintal, é manso e parece ter dono. Está alimentado e em segurança.',
                [null, AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small, AnimalColor::BlackAndWhite, 36, 'Mancha preta no focinho.']],
            [Post::factory()->lost()->active(), $walysson, UserSeeder::BELO_HORIZONTE, 'duke', 'Beagle Duke sumiu no bairro Savassi', 'Fugiu durante o passeio. Tem microchip e é muito amigável, se aproxima de qualquer pessoa.',
                ['Duke', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium, AnimalColor::Tricolor, 54, 'Coleira verde com plaquinha.']],
            [Post::factory()->found()->active(), $ruan, UserSeeder::UBERABA, 'labrador', 'Cadela preta encontrada na Praça Rui Barbosa', 'Encontrada com coleira, mas sem telefone na plaquinha. Muito dócil, está comigo até achar o tutor.',
                [null, AnimalSpecies::Dog, AnimalSex::Female, AnimalSize::Large, AnimalColor::Black, 60, 'Coleira vermelha com pingente rosa e mancha branca no peito.']],
            [Post::factory()->active(), $lucas, UserSeeder::IGARAPAVA, 'princesa', 'Princesa, gata tricolor castrada', 'Gata adulta, educada e muito limpinha. Acostumada a viver dentro de casa.',
                ['Princesa', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Tricolor, 42, 'Coleira rosa com pingente.']],
            [Post::factory()->active(), $lucas, UserSeeder::IGARAPAVA, 'milka', 'Milka, SRD de porte médio', 'Cadela alegre e brincalhona, ótima com crianças. Vacinada, vermifugada e castrada.',
                ['Milka', AnimalSpecies::Dog, AnimalSex::Female, AnimalSize::Medium, AnimalColor::BlackAndWhite, 14, 'Patas brancas e coleira rosa.']],
            [Post::factory()->active(), $ruan, UserSeeder::UBERABA, 'nala', 'Nala, gata calma e carinhosa', 'Gata de pelo claro e macio. Gosta de ambientes tranquilos e de dormir no sofá.',
                ['Nala', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Beige, 30, 'Orelhas dobradas.']],
            [Post::factory()->active(), $juliana, UserSeeder::BELO_HORIZONTE, 'pingo', 'Pingo, filhote esperto', 'Filhote de 4 meses, aprende rápido e já atende pelo nome.',
                ['Pingo', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Small, AnimalColor::Black, 4, 'Patas e sobrancelhas caramelo.']],
            [Post::factory()->active(), $leandro, UserSeeder::UBERLANDIA, 'biscoito', 'Biscoito, filhote de labrador', 'Filhote dócil de 3 meses. Entrego vermifugado e com a primeira vacina.',
                ['Biscoito', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Large, AnimalColor::Beige, 3, null]],
            [Post::factory()->lost()->active(), $camila, UserSeeder::UBERABA, 'pituca', 'Pituca sumiu no bairro Fabrício', 'Pug idosa, enxerga pouco e precisa de remédio para o coração. Saiu pelo portão aberto de manhã.',
                ['Pituca', AnimalSpecies::Dog, AnimalSex::Female, AnimalSize::Small, AnimalColor::Beige, 108, 'Focinho preto e roupinha listrada.']],
            [Post::factory()->found()->active(), $camila, UserSeeder::UBERABA, 'cafe', 'Cachorro cinza encontrado na Av. Leopoldino de Oliveira', 'Estava assustado no canteiro central. Usa coleira vermelha sem plaquinha. Está comigo esperando o tutor.',
                [null, AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium, AnimalColor::Gray, 30, 'Peito branco e coleira vermelha.']],
            [Post::factory()->lost()->active(), $ruan, UserSeeder::UBERABA, 'mingau', 'Mingau não voltou para casa', 'Gato frajola castrado, muito medroso. Some às vezes, mas nunca passou de uma noite fora.',
                ['Mingau', AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small, AnimalColor::BlackAndWhite, 60, 'Bigode branco e mancha preta no queixo.']],
            [Post::factory()->found()->active(), $lucas, UserSeeder::IGARAPAVA, 'rajado', 'Gato rajado encontrado no centro de Igarapava', 'Apareceu na loja e não quer ir embora. Bem tratado, deve ter casa por perto.',
                [null, AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Brindle, 36, null]],
        ]);
    }

    /**
     * Perdidos e achados que já voltaram para casa, para a página de reencontros.
     */
    private function reunions(User $camila, User $beatriz, User $lucas, User $juliana): void
    {
        $this->publish([
            [Post::factory()->lost()->resolved(), $camila, UserSeeder::UBERABA, 'pandora', 'Pandora fugiu durante a chuva', 'Gata escaminha, assustada com trovão. Voltou dois dias depois, um vizinho viu o anúncio e me avisou.',
                ['Pandora', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Tricolor, 48, null]],
            [Post::factory()->lost()->resolved(), $beatriz, UserSeeder::UBERLANDIA, 'bob', 'Bob sumiu no Parque do Sabiá', 'Soltou da guia durante a caminhada. Foi encontrado por uma família no dia seguinte, graças ao compartilhamento.',
                ['Bob', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium, AnimalColor::White, 72, null]],
            [Post::factory()->found()->resolved(), $lucas, UserSeeder::IGARAPAVA, 'fumaca', 'Gato cinza encontrado na praça da matriz', 'Encontrei miando na praça. A tutora viu o anúncio e veio buscar no mesmo dia.',
                ['Fumaça', AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small, AnimalColor::Gray, 24, null]],
            [Post::factory()->found()->resolved(), $juliana, UserSeeder::BELO_HORIZONTE, 'rex', 'Cachorro preto encontrado na Pampulha', 'Estava perdido perto da lagoa, já idoso e cansado. Tinha microchip e o tutor foi localizado em poucas horas.',
                ['Rex', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium, AnimalColor::Black, 96, 'Focinho grisalho e orelhas compridas.']],
        ]);
    }

    /**
     * Doações concluídas das contas novas, com avaliação dos dois lados.
     */
    private function donations(User $leandro, User $walysson, User $camila, User $beatriz, User $lucas, User $juliana): void
    {
        $posts = $this->publish([
            [Post::factory()->resolved(), $camila, UserSeeder::UBERABA, 'fiona', 'Fiona, cadela adulta e calma', 'Cadela de 5 anos, castrada, ótima companhia para quem mora em casa.',
                ['Fiona', AnimalSpecies::Dog, AnimalSex::Female, AnimalSize::Medium, AnimalColor::BlackAndWhite, 60, null]],
            [Post::factory()->resolved(), $beatriz, UserSeeder::UBERLANDIA, 'romeu', 'Romeu, gato laranja resgatado', 'Resgatado filhote, hoje com 1 ano. Castrado, vacinado e acostumado com cachorro.',
                ['Romeu', AnimalSpecies::Cat, AnimalSex::Male, AnimalSize::Small, AnimalColor::Orange, 12, null]],
            [Post::factory()->resolved(), $lucas, UserSeeder::IGARAPAVA, 'snoopy', 'Snoopy, beagle que adora brincar', 'Beagle de 4 anos resgatado na estrada. Muito alegre e cheio de energia.',
                ['Snoopy', AnimalSpecies::Dog, AnimalSex::Male, AnimalSize::Medium, AnimalColor::Tricolor, 48, null]],
            [Post::factory()->resolved(), $juliana, UserSeeder::BELO_HORIZONTE, 'lola', 'Lola, gata tranquila de 3 anos', 'Gata calma, castrada, adora ficar na janela observando a rua.',
                ['Lola', AnimalSpecies::Cat, AnimalSex::Female, AnimalSize::Small, AnimalColor::Brindle, 36, null]],
        ]);

        $this->completedAdoption($posts['fiona'], $walysson, [5, 'Camila entregou a Fiona com ração e caminha. Super atenciosa.'], [5, 'Walysson manda vídeos da Fiona correndo no quintal.']);
        $this->completedAdoption($posts['romeu'], $leandro, [5, 'Beatriz explicou toda a alimentação do Romeu. Adoção perfeita.'], [4, 'Leandro cuidou muito bem da adaptação.']);
        $this->completedAdoption($posts['snoopy'], $camila, [5, 'O Snoopy chegou saudável e vacinado. Lucas foi muito prestativo.'], [5, 'Camila preparou tudo para receber o Snoopy.']);
        $this->completedAdoption($posts['lola'], $beatriz, [4, 'Juliana foi muito cuidadosa e explicou a rotina da Lola.'], [5, 'Beatriz é veterinária, a Lola está em ótimas mãos.']);
    }

    /**
     * Cria o animal, o post aprovado e a foto de cada linha; devolve os posts pelo nome da foto.
     *
     * @param  list<array{0: PostFactory, 1: User, 2: int, 3: string, 4: string, 5: string, 6: array<int, mixed>}>  $rows
     * @return array<string, Post>
     */
    private function publish(array $rows): array
    {
        $posts = [];

        foreach ($rows as [$factory, $owner, $municipality, $photo, $title, $description, $animal]) {
            $posts[$photo] = $this->recordApproval($this->post($factory, $owner, $this->animal($owner, ...$animal), $photo, [
                'municipality_id' => $municipality,
                'title' => $title,
                'description' => $description,
            ]));
        }

        return $posts;
    }

    /**
     * @param  array{0: int, 1: string}  $adopterReview
     * @param  array{0: int, 1: string}  $ownerReview
     */
    private function completedAdoption(Post $post, User $adopter, array $adopterReview, array $ownerReview): void
    {
        $adoption = Adoption::factory()->completed()->for($post)->create(['adopter_id' => $adopter->id]);

        Review::factory()->for($adoption)->create([
            'rating' => $adopterReview[0],
            'comment' => $adopterReview[1],
        ]);
        Review::factory()->for($adoption)->create([
            'reviewer_id' => $post->user_id,
            'reviewee_id' => $adopter->id,
            'rating' => $ownerReview[0],
            'comment' => $ownerReview[1],
        ]);
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
     * A foto {$photo}.webp é a capa; {$photo}-2.webp, {$photo}-3.webp... entram na galeria.
     *
     * @param  array<string, mixed>  $attributes
     */
    private function post(PostFactory $factory, User $owner, Animal $animal, string $photo, array $attributes): Post
    {
        $post = $factory->recycle($this->admin)->for($owner)->for($animal)->create($attributes);

        $gallery = glob(database_path("seeders/images/posts/{$photo}-*.webp"));
        natsort($gallery);
        $sources = [database_path("seeders/images/posts/{$photo}.webp"), ...$gallery];

        foreach (array_values($sources) as $position => $source) {
            $image = file_get_contents($source);
            $path = "posts/{$post->id}/".Str::uuid().'.webp';
            Storage::disk('public')->put($path, $image);

            $post->files()->create([
                'path' => $path,
                'disk' => 'public',
                'hash' => hash('sha256', $image),
                'size' => strlen($image),
                'mime_type' => 'image/webp',
                'position' => $position,
            ]);
        }

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
     * Mensagens com 20 minutos entre si, terminando $daysAgo dias atrás. As últimas
     * $unread ficam sem leitura, para a conversa aparecer como não lida.
     *
     * @param  list<array{0: User, 1: string}>  $messages
     */
    private function conversation(Post $post, User $interested, int $daysAgo, int $unread, array $messages): void
    {
        $conversation = Conversation::factory()->for($post)->create(['interested_id' => $interested->id]);
        $lastAt = now()->subDays($daysAgo)->subMinutes(15);

        foreach ($messages as $position => [$sender, $body]) {
            $sentAt = $lastAt->copy()->subMinutes(20 * (count($messages) - 1 - $position));
            $isUnread = $position >= count($messages) - $unread;

            Message::factory()->for($conversation)->create([
                'sender_id' => $sender->id,
                'body' => $body,
                'read_at' => $isUnread ? null : $sentAt->copy()->addMinutes(5),
                'created_at' => $sentAt,
                'updated_at' => $sentAt,
            ]);
        }

        $conversation->forceFill(['last_message_at' => $conversation->messages()->max('created_at')])->save();
    }
}
