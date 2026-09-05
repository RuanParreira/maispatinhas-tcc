<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * last_message_at é desnormalizado de messages para ordenar a caixa de
     * entrada sem agregação.
     */
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('advertiser_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('interested_id')->constrained('users')->cascadeOnDelete();
            $table->string('status', 20)->default('ativa');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->unique(['post_id', 'interested_id']);
            $table->index(['advertiser_id', 'last_message_at']);
            $table->index(['interested_id', 'last_message_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
