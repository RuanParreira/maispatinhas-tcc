<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * O animal não tem status: ele é derivado dos posts e adoções.
     * Booleanos de saúde aceitam NULL para o doador que não sabe o histórico.
     */
    public function up(): void
    {
        Schema::create('animals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->string('name', 80);
            $table->string('species', 20);
            $table->string('breed', 80)->nullable();
            $table->string('sex', 20);
            $table->string('size', 20);
            $table->string('color', 60)->nullable();
            $table->text('distinctive_marks')->nullable();
            $table->date('approximate_birth_date')->nullable();
            $table->boolean('vaccinated')->nullable();
            $table->boolean('dewormed')->nullable();
            $table->boolean('neutered')->nullable();
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
