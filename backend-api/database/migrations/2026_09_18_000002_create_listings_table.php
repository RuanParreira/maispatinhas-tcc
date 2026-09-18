<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * occurred_at only applies to lost/found listings.
     * published_at is set on approval and reset when an expired listing is renewed.
     */
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
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
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
