<?php

namespace App\Actions;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Encerra todas as sessões do usuário, exceto a atual. Trocar o
 * remember_token também impede que cookies de "lembrar de mim" logem
 * os outros dispositivos de novo.
 */
class LogoutOtherDevices
{
    public function handle(User $user, string $currentSessionId): void
    {
        $user->remember_token = Str::random(60);
        $user->save();

        DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', '!=', $currentSessionId)
            ->delete();
    }
}
