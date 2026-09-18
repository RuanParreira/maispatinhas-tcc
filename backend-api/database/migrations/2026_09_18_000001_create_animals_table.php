<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('animals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->string('name', 60)->nullable();
            $table->enum('species', ['dog', 'cat', 'bird', 'rodent', 'rabbit', 'other']);
            $table->string('breed', 60);
            $table->enum('sex', ['male', 'female', 'undefined']);
            $table->enum('size', ['small', 'medium', 'large']);
            $table->string('color', 60);
            $table->text('distinctive_features');
            $table->date('approximate_birth_date');
            $table->boolean('vaccinated');
            $table->boolean('dewormed');
            $table->boolean('neutered');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('animals');
    }
};
