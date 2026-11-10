<?php

namespace App\Models;

use App\Enums\AnimalAgeGroup;
use App\Enums\AnimalSex;
use App\Enums\AnimalSize;
use App\Enums\AnimalSpecies;
use Database\Factories\AnimalFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
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
     * Atributos convertidos automaticamente (casts).
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
     * @param  Builder<Animal>  $query
     */
    #[Scope]
    protected function inAgeGroup(Builder $query, AnimalAgeGroup $group): void
    {
        $oneYearAgo = today()->subYear();
        $eightYearsAgo = today()->subYears(8);

        match ($group) {
            AnimalAgeGroup::Young => $query->where('approximate_birth_date', '>', $oneYearAgo),
            AnimalAgeGroup::Adult => $query
                ->where('approximate_birth_date', '>', $eightYearsAgo)
                ->where('approximate_birth_date', '<=', $oneYearAgo),
            AnimalAgeGroup::Senior => $query->where('approximate_birth_date', '<=', $eightYearsAgo),
        };
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<Post, $this>
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * @return HasMany<Adoption, $this>
     */
    public function adoptions(): HasMany
    {
        return $this->hasMany(Adoption::class);
    }
}
