<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * locked_post_id enforces at most one in_progress/completed adoption per post:
     * it holds post_id only in those states and NULL otherwise, and UNIQUE ignores NULLs.
     *
     * donor and animal are not stored here: posts.user_id and posts.animal_id are locked
     * against mass assignment, so they are read through the post relation instead of
     * duplicating them into a column that could drift out of sync.
     */
    public function up(): void
    {
        Schema::create('adoptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->restrictOnDelete();
            $table->foreignId('adopter_id')->constrained('users')->restrictOnDelete();
            $table->enum('status', ['requested', 'in_progress', 'completed', 'refused', 'canceled'])->default('requested');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unsignedBigInteger('locked_post_id')
                ->nullable()
                ->storedAs("case when status in ('in_progress', 'completed') then post_id end")
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
