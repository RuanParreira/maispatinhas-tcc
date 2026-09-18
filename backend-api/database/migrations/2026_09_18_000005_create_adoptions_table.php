<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * locked_listing_id enforces at most one in_progress/completed adoption per listing:
     * it holds listing_id only in those states and NULL otherwise, and UNIQUE ignores NULLs.
     */
    public function up(): void
    {
        Schema::create('adoptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->restrictOnDelete();
            $table->foreignId('donor_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('animal_id')->constrained()->restrictOnDelete();
            $table->foreignId('adopter_id')->constrained('users')->restrictOnDelete();
            $table->enum('status', ['requested', 'in_progress', 'completed', 'refused', 'canceled'])->default('requested');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unsignedBigInteger('locked_listing_id')
                ->nullable()
                ->storedAs("case when status in ('in_progress', 'completed') then listing_id end")
                ->unique();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adoptions');
    }
};
