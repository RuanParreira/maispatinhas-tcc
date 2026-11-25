<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * Contas de desenvolvimento local. Todas as senhas são "password".
 * As fotos de perfil ficam em database/seeders/images/avatars, já em WebP.
 */
class UserSeeder extends Seeder
{
    public const UBERABA = 3170107;

    public const UBERLANDIA = 3170206;

    public const DELTA = 3121258;

    public const IGARAPAVA = 3520103;

    public const BELO_HORIZONTE = 3106200;

    /**
     * Popula o banco de dados.
     */
    public function run(): void
    {
        $this->withAvatar(User::factory()->admin()->create([
            'name' => 'Administrador',
            'email' => 'admin@gmail.com',
            'municipality_id' => self::UBERABA,
        ]), 'admin');

        $this->withAvatar(User::factory()->create([
            'name' => 'Ruan',
            'email' => 'ruan@gmail.com',
            'municipality_id' => self::UBERABA,
            'bio' => 'Moro em casa com quintal em Uberaba e já tive cachorro e gato. Gosto de acompanhar os bichos depois da adoção.',
        ]), 'ruan');

        $this->withAvatar(User::factory()->create([
            'name' => 'Leandro',
            'email' => 'leandro@gmail.com',
            'municipality_id' => self::UBERLANDIA,
            'bio' => 'Ajudo a ONG do bairro com lar temporário. Sempre tenho algum filhote ou coelho procurando família.',
        ]), 'leandro');

        $this->withAvatar(User::factory()->create([
            'name' => 'Walysson',
            'email' => 'walysson@gmail.com',
            'municipality_id' => self::DELTA,
            'bio' => 'Resgato gatos em Delta e região. Entrego castrados, vacinados e com orientação sobre a adaptação.',
        ]), 'walysson');

        $this->withAvatar(User::factory()->create([
            'name' => 'Camila',
            'email' => 'camila@gmail.com',
            'municipality_id' => self::UBERABA,
            'bio' => 'Voluntária em feiras de adoção em Uberaba. Tenho duas gatas e sempre ajudo a divulgar animais perdidos.',
        ]), 'camila');

        $this->withAvatar(User::factory()->create([
            'name' => 'Beatriz',
            'email' => 'beatriz@gmail.com',
            'municipality_id' => self::UBERLANDIA,
            'bio' => 'Veterinária em Uberlândia. Faço lar temporário para gatos resgatados até encontrarem família.',
        ]), 'beatriz');

        $this->withAvatar(User::factory()->create([
            'name' => 'Lucas',
            'email' => 'lucas@gmail.com',
            'municipality_id' => self::IGARAPAVA,
            'bio' => 'Moro em sítio em Igarapava e acolho cães abandonados na estrada. Todos saem vacinados.',
        ]), 'lucas');

        $this->withAvatar(User::factory()->create([
            'name' => 'Juliana',
            'email' => 'juliana@gmail.com',
            'municipality_id' => self::BELO_HORIZONTE,
            'bio' => 'Protetora independente em Belo Horizonte. Ajudo tutores a reencontrar pets perdidos na região.',
        ]), 'juliana');
    }

    private function withAvatar(User $user, string $avatar): void
    {
        $path = "avatars/{$avatar}.webp";
        Storage::disk('public')->put($path, file_get_contents(database_path("seeders/images/{$path}")));

        $user->forceFill(['avatar_path' => $path])->save();
    }
}
