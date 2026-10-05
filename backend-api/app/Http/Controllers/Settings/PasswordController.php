<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdatePasswordRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PasswordController extends Controller
{
    /**
     * Changes the password and ends every other session of the user,
     * so a leaked password stops working on other devices right away.
     * Rotating remember_token also invalidates "remember me" cookies.
     */
    public function update(UpdatePasswordRequest $request): Response
    {
        $user = $request->user();

        $user->remember_token = Str::random(60);
        $user->password = $request->string('password');
        $user->save();

        DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        return response()->noContent();
    }
}
