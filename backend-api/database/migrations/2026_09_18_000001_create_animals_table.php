<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executa a migration.
     */
    public function up(): void
    {
        Schema::create('animals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->string('name', 60)->nullable();
            $table->enum('species', ['dog', 'cat', 'bird', 'rodent', 'rabbit', 'other']);
            $table->string('breed', 60)->nullable();
            $table->enum('sex', ['male', 'female', 'undefined']);
            $table->enum('size', ['small', 'medium', 'large']);
            $table->enum('color', ['black', 'white', 'gray', 'caramel', 'golden', 'orange', 'brown', 'beige', 'black_and_white', 'brindle', 'tricolor', 'siamese', 'other']);
            $table->text('distinctive_features')->nullable();
            $table->date('approximate_birth_date')->nullable();
            $table->boolean('vaccinated')->nullable();
            $table->boolean('dewormed')->nullable();
            $table->boolean('neutered')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Desfaz a migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('animals');
    }
};
