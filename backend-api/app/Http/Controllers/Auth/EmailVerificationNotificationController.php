<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['status' => __('E-mail já verificado.')]);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['status' => __('Link de verificação enviado.')]);
    }
}
