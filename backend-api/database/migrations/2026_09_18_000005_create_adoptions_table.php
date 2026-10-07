<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executa a migration.
     *
     * locked_post_id garante no máximo uma adoção in_progress/completed por post:
     * guarda o post_id só nesses estados e NULL nos demais, e o UNIQUE ignora NULLs.
     *
     * doador e animal não ficam aqui: posts.user_id e posts.animal_id são protegidos contra
     * mass assignment, então são lidos pela relação com o post em vez de duplicados numa
     * coluna que poderia ficar dessincronizada.
     */
    public function up(): void
    {
        Schema::create('adoptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->restrictOnDelete();
            $table->foreignId('adopter_id')->constrained('users')->restrictOnDelete();
            $table->enum('status', ['requested', 'in_progress', 'completed', 'refused', 'canceled'])->default('requested');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unsignedBigInteger('locked_post_id')
                ->nullable()
                ->storedAs("case when status in ('in_progress', 'completed') then post_id end")
                ->unique();
        });
    }

    /**
     * Desfaz a migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('adoptions');
    }
};
