<?php

namespace App\Models;

use Database\Factories\MunicipalityFactory;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Read-only reference data, loaded by MunicipalitySeeder.
 */
#[Table(key: 'ibge_code', keyType: 'int', incrementing: false, timestamps: false)]
class Municipality extends Model
{
    /** @use HasFactory<MunicipalityFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    /**
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'municipality_id');
    }

    /**
     * @return HasMany<Listing, $this>
     */
    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class, 'municipality_id');
    }
}
