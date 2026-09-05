<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A coluna gerada exclusive_post_id garante no máximo uma adoção
     * em_andamento ou concluida por post: fora desses status ela fica NULL, e
     * NULL repetido passa no índice único. Substitui o índice único parcial,
     * que o InnoDB não tem.
     */
    public function up(): void
    {
        Schema::create('adoptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->restrictOnDelete();
            $table->foreignId('donor_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('animal_id')->constrained('animals')->restrictOnDelete();
            $table->foreignId('adopter_id')->constrained('users')->restrictOnDelete();
            $table->string('status', 20)->default('solicitada');
            $table->dateTime('scheduled_at')->nullable();
            $table->unsignedBigInteger('exclusive_post_id')
                ->storedAs("CASE WHEN status IN ('em_andamento', 'concluida') THEN post_id END");
            $table->timestamps();

            $table->unique('exclusive_post_id', 'adoptions_exclusive_post_unique');
            $table->index(['post_id', 'status']);
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
