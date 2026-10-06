<?php

namespace App\Http\Controllers\Settings;

use App\Actions\LogoutOtherDevices;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdatePasswordRequest;
use Illuminate\Http\Response;

class PasswordController extends Controller
{
    /**
     * Changes the password and ends every other session of the user,
     * so a leaked password stops working on other devices right away.
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
