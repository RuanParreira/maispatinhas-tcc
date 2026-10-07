<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Executa a migration.
     *
     * occurred_at só se aplica a posts de perdido/encontrado.
     * published_at é definido na aprovação e reiniciado quando um post expirado é renovado.
     * user_id e animal_id ficam travados após a criação: as adoções dependem de que
     * nunca mudem, por isso ficam de fora do fillable do model de propósito.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('animal_id')->constrained()->restrictOnDelete();
            $table->enum('type', ['adoption', 'lost', 'found']);
            $table->string('title', 120);
            $table->text('description');
            $table->enum('status', [
                'draft',
                'pending_approval',
                'rejected',
                'active',
                'paused',
                'expired',
                'resolved',
                'closed',
                'canceled',
            ])->default('draft');
            $table->unsignedInteger('municipality_id');
            $table->date('occurred_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('municipality_id')->references('ibge_code')->on('municipalities')->restrictOnDelete();
            $table->index(['status', 'municipality_id', 'published_at']);
            $table->index(['status', 'published_at']);
        });
    }

    /**
     * Desfaz a migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
