<?php

use Illuminate\Support\Facades\Route;

Route::permanentRedirect('/', '/home');
Route::livewire('/home', 'pages.home')->name('home');

Route::middleware('guest')->group(function () {
    Route::view('/login', 'auth.login')->name('login');
    Route::view('/register', 'auth.register')->name('register');
});

Route::middleware('auth')->group(function () {
    Route::livewire('/adoptions', 'pages.adoptions')->name('adoptions.index');
});
