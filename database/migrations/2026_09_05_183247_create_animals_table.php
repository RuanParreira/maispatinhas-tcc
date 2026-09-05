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
            /**
             * O animal não guarda status: ele é derivado dos anúncios e adoções.
             * Ver "Fluxo Status de Adocao" no vault.
             */
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->string('name', 80);

            /** Enum AnimalSpecies: cachorro, gato, ave, roedor, coelho, outro. */
            $table->string('species', 20);
            $table->string('breed', 80)->nullable();

            /** Enum AnimalSex: macho, femea, indefinido. */
            $table->string('sex', 20);

            /** Enum AnimalSize: pequeno, medio, grande. */
            $table->string('size', 20);
            $table->string('color', 60)->nullable();
            $table->text('distinctive_marks')->nullable();
            $table->date('approximate_birth_date')->nullable();

            /** Booleanos de saúde aceitam NULL: o doador pode não saber o histórico do animal. */
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
