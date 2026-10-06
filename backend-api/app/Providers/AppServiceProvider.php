<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * A named limiter keeps its own counter: the plain throttle:6,1 counts
     * every route that uses it together, so a few photo uploads would
     * also block password and e-mail changes.
     */
    public function boot(): void
    {
        RateLimiter::for('avatar', fn (Request $request) => Limit::perMinute(10)->by($request->user()->id));
    }
}
