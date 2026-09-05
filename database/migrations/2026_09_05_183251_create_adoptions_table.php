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
        Schema::create('adoptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->restrictOnDelete();
            $table->foreignId('donor_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('animal_id')->constrained('animals')->restrictOnDelete();
            $table->foreignId('adopter_id')->constrained('users')->restrictOnDelete();

            /**
             * Enum AdoptionStatus: solicitada, em_andamento, concluida, recusada, cancelada.
             */
            $table->string('status', 20)->default('solicitada');

            /** Data e hora combinada para a entrega do animal. */
            $table->dateTime('scheduled_at')->nullable();

            /**
             * Coluna gerada que materializa a regra "no máximo uma adoção em_andamento ou
             * concluida por post". Fora desses dois status ela fica NULL, e MySQL e
             * SQLite permitem NULL repetido em índice único — então várias solicitada
             * coexistem, mas o segundo aceite do mesmo post falha no banco.
             *
             * Substitui o índice único parcial, que o InnoDB não tem.
             */
            $table->unsignedBigInteger('exclusive_post_id')
                ->storedAs("CASE WHEN status IN ('em_andamento', 'concluida') THEN post_id END");

            $table->timestamps();

            $table->unique('exclusive_post_id', 'adoptions_exclusive_post_unique');

            /** Interessados de um post, para o doador escolher entre eles. */
            $table->index(['post_id', 'status']);

            /** "Minhas adoções", nas duas pontas. */
            $table->index(['adopter_id', 'status']);
            $table->index(['donor_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adoptions');
    }
};
