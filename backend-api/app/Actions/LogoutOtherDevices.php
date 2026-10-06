<?php

namespace App\Actions;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Ends every session of the user except the current one. Rotating
 * remember_token also keeps "remember me" cookies from logging the
 * other devices back in.
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
