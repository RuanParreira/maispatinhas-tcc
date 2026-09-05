<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A localização é repetida aqui de propósito: o local do avistamento não é
     * onde o autor mora, e o catálogo filtra por região sem JOIN com addresses.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('animal_id')->constrained('animals')->restrictOnDelete();
            $table->string('type', 20);
            $table->string('title', 150);
            $table->text('description');
            $table->string('status', 30)->default('rascunho');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('city', 120);
            $table->char('state', 2);
            $table->char('ibge_code', 7)->nullable();
            $table->dateTime('occurred_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'type', 'ibge_code', 'published_at'], 'posts_catalog_region_index');
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
