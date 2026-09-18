<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Read-only reference table, populated by MunicipalitySeeder.
     */
    public function up(): void
    {
        Schema::create('municipalities', function (Blueprint $table) {
            $table->unsignedInteger('ibge_code')->primary();
            $table->string('name', 100)->index();
            $table->char('state', 2)->index();
            $table->decimal('latitude', 9, 6);
            $table->decimal('longitude', 9, 6);

            $table->index(['latitude', 'longitude']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('municipalities');
    }
};
