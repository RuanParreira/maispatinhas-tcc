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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('advertiser_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('interested_id')->constrained('users')->cascadeOnDelete();

            /** Enum ConversationStatus: ativa, arquivada, bloqueada. */
            $table->string('status', 20)->default('ativa');

            /**
             * Desnormalizado a partir de `messages` para ordenar a caixa de entrada sem
             * agregação. Atualizado no mesmo fluxo que insere a mensagem.
             */
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            /** Um interessado tem uma única conversa por post. */
            $table->unique(['post_id', 'interested_id']);

            /** Caixa de entrada das duas pontas, ordenada pela mensagem mais recente. */
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
