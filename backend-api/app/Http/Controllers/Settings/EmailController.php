<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateEmailRequest;
use Illuminate\Http\JsonResponse;

class EmailController extends Controller
{
    /**
     * The new address must be verified again before it is trusted.
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
