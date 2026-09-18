<?php

namespace App\Models;

use App\Enums\AnimalSex;
use App\Enums\AnimalSize;
use App\Enums\AnimalSpecies;
use Database\Factories\AnimalFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'user_id',
    'name',
    'species',
    'breed',
    'sex',
    'size',
    'color',
    'distinctive_features',
    'approximate_birth_date',
    'vaccinated',
    'dewormed',
    'neutered',
])]
class Animal extends Model
{
    /** @use HasFactory<AnimalFactory> */
    use HasFactory, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'species' => AnimalSpecies::class,
            'sex' => AnimalSex::class,
            'size' => AnimalSize::class,
            'approximate_birth_date' => 'date',
            'vaccinated' => 'boolean',
            'dewormed' => 'boolean',
            'neutered' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<Listing, $this>
     */
    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }

    /**
     * @return HasMany<Adoption, $this>
     */
    public function adoptions(): HasMany
    {
        return $this->hasMany(Adoption::class);
    }
}
