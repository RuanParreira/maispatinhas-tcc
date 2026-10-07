<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateEmailRequest;
use Illuminate\Http\JsonResponse;

class EmailController extends Controller
{
    /**
     * O novo endereço precisa ser verificado de novo antes de ser considerado confiável.
     */
    public function update(UpdateEmailRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->email = $request->string('email');
        $user->email_verified_at = null;
        $user->save();

        $user->sendEmailVerificationNotification();

        return response()->json($user);
    }
}
