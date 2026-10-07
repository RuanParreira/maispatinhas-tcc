<?php

use App\Http\Controllers\AnimalController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\MunicipalityController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\Profile;
use App\Http\Controllers\Settings\AvatarController;
use App\Http\Controllers\Settings\EmailController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::get('/municipalities', [MunicipalityController::class, 'index']);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);

// Perfil público (contas anonimizadas respondem 404 via UserPolicy)
Route::middleware(['throttle:60,1', 'can:view,user'])->group(function () {
    Route::get('/users/{user}', [Profile\ProfileController::class, 'show']);
    Route::get('/users/{user}/posts', [Profile\PostController::class, 'index']);
    Route::get('/users/{user}/adoptions', [Profile\AdoptionController::class, 'index']);
    Route::get('/users/{user}/reviews', [Profile\ReviewController::class, 'index']);
});

// Rotas públicas com limite de requisições
Route::middleware('throttle:6,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
    Route::post('/reset-password', [NewPasswordController::class, 'store']);
});

// Rotas protegidas (apenas usuários autenticados)
Route::middleware('auth:sanctum')->group(function () {
    // Rotas de Usuário
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rotas de configurações da conta
    Route::put('/user/profile', [ProfileController::class, 'update']);
    Route::get('/user/sessions', [SessionController::class, 'index']);

    Route::middleware('throttle:avatar')->group(function () {
        Route::post('/user/avatar', [AvatarController::class, 'update']);
        Route::delete('/user/avatar', [AvatarController::class, 'destroy']);
    });

    Route::middleware('throttle:6,1')->group(function () {
        Route::put('/user/password', [PasswordController::class, 'update']);
        Route::put('/user/email', [EmailController::class, 'update']);
        Route::delete('/user/sessions', [SessionController::class, 'destroy']);
        Route::delete('/user', [ProfileController::class, 'destroy']);
    });

    // Rotas de verificação de e-mail
    Route::middleware('throttle:6,1')->group(function () {
        Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
            ->middleware('signed')
            ->name('verification.verify');

        Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store']);
    });

    // Rotas de Animais
    Route::get('/animals', [AnimalController::class, 'index']);
    Route::post('/animals', [AnimalController::class, 'store']);
    Route::get('/animals/{animal}', [AnimalController::class, 'show']);

    // Rotas de Posts
    Route::post('/posts', [PostController::class, 'store'])->middleware('throttle:posts');
    Route::get('/my-posts', [PostController::class, 'myPosts']);
});
