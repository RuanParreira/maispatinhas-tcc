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
use Illuminate\Support\Carbon;

/**
 * O animal não guarda status: ele é derivado dos posts e adoções.
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property AnimalSpecies $species
 * @property string|null $breed
 * @property AnimalSex $sex
 * @property AnimalSize $size
 * @property string|null $color
 * @property string|null $distinctive_marks
 * @property Carbon|null $approximate_birth_date
 * @property bool|null $vaccinated
 * @property bool|null $dewormed
 * @property bool|null $neutered
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'name',
    'species',
    'breed',
    'sex',
    'size',
    'color',
    'distinctive_marks',
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
