<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A coluna de ordenação se chama sort_order porque `order` é palavra
     * reservada no MySQL.
     */
    public function up(): void
    {
        Schema::create('archives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->string('filename');
            $table->string('path', 500);
            $table->string('disk', 50)->default('public');
            $table->char('hash', 64)->nullable();
            $table->unsignedBigInteger('size');
            $table->string('content_type', 120);
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

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
