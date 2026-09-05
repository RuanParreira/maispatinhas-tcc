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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('animal_id')->constrained('animals')->restrictOnDelete();

            /** Enum PostType: adocao, perdido, encontrado. */
            $table->string('type', 20);
            $table->string('title', 150);
            $table->text('description');

            /**
             * Enum PostStatus: rascunho, pendente_aprovacao, rejeitado, ativo,
             * pausado, expirado, resolvido, encerrado, cancelado.
             */
            $table->string('status', 30)->default('rascunho');

            /**
             * Localização do post, desnormalizada do endereço do autor de propósito:
             * o local do avistamento não é necessariamente onde o autor mora, e o
             * catálogo filtra por região sem precisar de JOIN com `addresses`.
             */
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('city', 120);
            $table->char('state', 2);
            $table->char('ibge_code', 7)->nullable();

            /** Data do último avistamento (perdido / encontrado). */
            $table->dateTime('occurred_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            /**
             * Catálogo com filtro regional:
             * WHERE status = 'ativo' AND type = ? AND ibge_code IN (?) ORDER BY published_at DESC.
             */
            $table->index(['status', 'type', 'ibge_code', 'published_at'], 'posts_catalog_region_index');

            /** Mesma consulta sem recorte regional, para a ordenação continuar servida pelo índice. */
            $table->index(['status', 'type', 'published_at'], 'posts_catalog_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
