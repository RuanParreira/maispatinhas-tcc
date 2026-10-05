<?php

namespace App\Http\Controllers\Settings;

use App\Actions\AnonymizeUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\DestroyAccountRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function destroy(DestroyAccountRequest $request, AnonymizeUser $anonymizeUser): Response
    {
        $anonymizeUser->handle($request->user());

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
