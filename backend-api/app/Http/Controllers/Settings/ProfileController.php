<?php

namespace App\Http\Controllers\Settings;

use App\Actions\AnonymizeUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\DestroyAccountRequest;
use App\Http\Requests\Settings\UpdateProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        $user->name = $request->string('name')->trim();
        $user->phone = $request->string('phone');
        $user->bio = $request->filled('bio') ? $request->string('bio')->trim() : null;
        $user->municipality_id = $request->integer('municipality_id');
        $user->save();

        return response()->json($user);
    }

    public function destroy(DestroyAccountRequest $request, AnonymizeUser $anonymizeUser): Response
    {
        $anonymizeUser->handle($request->user());

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
