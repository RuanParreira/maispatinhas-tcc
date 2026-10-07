<?php

namespace App\Http\Controllers\Settings;

use App\Actions\LogoutOtherDevices;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdatePasswordRequest;
use Illuminate\Http\Response;

class PasswordController extends Controller
{
    /**
     * Troca a senha e encerra todas as outras sessões do usuário, para que
     * uma senha vazada pare de funcionar nos outros dispositivos na hora.
     */
    public function update(UpdatePasswordRequest $request, LogoutOtherDevices $logoutOtherDevices): Response
    {
        $user = $request->user();

        $user->password = $request->string('password');
        $user->save();

        $logoutOtherDevices->handle($user, $request->session()->getId());

        return response()->noContent();
    }
}
