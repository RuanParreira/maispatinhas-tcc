<?php

namespace App\Http\Controllers\Settings;

use App\Actions\LogoutOtherDevices;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\DestroySessionsRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class SessionController extends Controller
{
    /**
     * Os ids de sessão nunca são expostos: funcionam como tokens de autenticação.
     * A chave é um hash de mão única, estável o bastante para o front usar como key da lista.
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

    public function destroy(DestroySessionsRequest $request, LogoutOtherDevices $logoutOtherDevices): Response
    {
        $logoutOtherDevices->handle($request->user(), $request->session()->getId());

        return response()->noContent();
    }
}
