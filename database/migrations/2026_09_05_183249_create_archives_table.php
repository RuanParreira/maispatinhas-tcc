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
        Schema::create('archives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->string('filename');
            $table->string('path', 500);
            $table->string('disk', 50)->default('public');

            /** SHA-256 do conteúdo. Índice só quando a deduplicação de upload for implementada. */
            $table->char('hash', 64)->nullable();
            $table->unsignedBigInteger('size');
            $table->string('content_type', 120);

            /** `order` é palavra reservada no MySQL; a coluna usa `sort_order`. */
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            /** Galeria do post, já na ordem de exibição. */
            $table->index(['post_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archives');
    }
};
