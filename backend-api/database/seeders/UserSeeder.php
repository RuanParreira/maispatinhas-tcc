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
    }

    private function withAvatar(User $user, string $avatar): void
    {
        $path = "avatars/{$avatar}.webp";
        Storage::disk('public')->put($path, file_get_contents(database_path("seeders/images/{$path}")));

        $user->forceFill(['avatar_path' => $path])->save();
    }
}
