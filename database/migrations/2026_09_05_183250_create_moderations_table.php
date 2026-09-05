<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Log imutável: linha existente nunca é editada, por isso não há
     * updated_at nem soft delete.
     */
    public function up(): void
    {
        Schema::create('moderations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('moderator_id')->constrained('users')->restrictOnDelete();
            $table->string('action', 20);
            $table->text('reason')->nullable();
            $table->timestamp('created_at')->useCurrent();

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
