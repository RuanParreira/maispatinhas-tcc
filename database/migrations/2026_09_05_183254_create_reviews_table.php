<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            /** Só adoção CONCLUIDA libera avaliação — a regra é da aplicação. */
            $table->foreignId('adoption_id')->constrained()->restrictOnDelete();
            $table->foreignId('reviewer_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('reviewee_id')->constrained('users')->restrictOnDelete();
            $table->unsignedTinyInteger('rating');
            $table->text('comment')->nullable();
            $table->timestamps();

            /** Cada parte avalia a outra uma única vez por adoção. */
            $table->unique(['adoption_id', 'reviewer_id']);

            /** Reputação exibida no perfil do avaliado. */
            $table->index(['reviewee_id', 'created_at']);
        });

        /**
         * O schema builder do Laravel não emite CHECK, e o SQLite só aceita CHECK dentro
         * do CREATE TABLE — não há ALTER TABLE ADD CONSTRAINT lá. As duas regras ficam
         * garantidas no MySQL/MariaDB de produção e, no SQLite dos testes, apenas na
         * validação da aplicação.
         */
        if (in_array(Schema::getConnection()->getDriverName(), ['mysql', 'mariadb'], true)) {
            DB::statement('ALTER TABLE reviews ADD CONSTRAINT reviews_rating_check CHECK (rating BETWEEN 1 AND 5)');
            DB::statement('ALTER TABLE reviews ADD CONSTRAINT reviews_distinct_parties_check CHECK (reviewer_id <> reviewee_id)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
