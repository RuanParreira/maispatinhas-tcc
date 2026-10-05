<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\DestroySessionsRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SessionController extends Controller
{
    /**
     * Session ids are never exposed: they work as authentication tokens.
     * The key is a one-way hash, stable enough for the front to use as a list key.
     */
    public function index(Request $request): JsonResponse
    {
        $currentId = $request->session()->getId();

        $sessions = DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('last_activity')
            ->get(['id', 'ip_address', 'user_agent', 'last_activity'])
            ->map(fn ($session) => [
                'key' => hash('xxh128', $session->id),
                'ip_address' => $session->ip_address,
                'user_agent' => $session->user_agent,
                'last_active_at' => Carbon::createFromTimestamp($session->last_activity)->toIso8601String(),
                'is_current' => $session->id === $currentId,
            ]);

        return response()->json($sessions);
    }

    /**
     * Rotating remember_token keeps "remember me" cookies from
     * logging the other devices back in.
     */
    public function destroy(DestroySessionsRequest $request): Response
    {
        $user = $request->user();
        $user->remember_token = Str::random(60);
        $user->save();

        DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        return response()->noContent();
    }
}
