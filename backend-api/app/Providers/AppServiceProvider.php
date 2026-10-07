<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Registra os serviços da aplicação.
     */
    public function register(): void
    {
        //
    }

    /**
     * Inicializa os serviços da aplicação.
     *
     * Um limiter nomeado tem contador próprio: o throttle:6,1 simples conta
     * junto todas as rotas que o usam, então alguns uploads de foto ou anúncios
     * criados também bloqueariam a troca de senha e de e-mail.
     */
    public function boot(): void
    {
        RateLimiter::for('avatar', fn (Request $request) => Limit::perMinute(10)->by($request->user()->id));
        RateLimiter::for('posts', fn (Request $request) => Limit::perMinute(6)->by($request->user()->id));
    }
}
