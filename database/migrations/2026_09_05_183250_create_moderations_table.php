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
        Schema::create('moderations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('moderator_id')->constrained('users')->restrictOnDelete();

            /** Enum ModerationAction: aprovacao, rejeicao. */
            $table->string('action', 20);
            $table->text('reason')->nullable();

            $table->timestamp('created_at')->useCurrent();

            /** Histórico de moderação de um post, do mais recente para o mais antigo. */
            $table->index(['post_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('moderations');
    }
};
