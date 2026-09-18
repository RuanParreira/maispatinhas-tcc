<?php

namespace App\Models;

use App\Enums\AdoptionStatus;
use Database\Factories\AdoptionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * status and completed_at are not fillable: they follow the adoption flow.
 * locked_listing_id is a generated column, never written by the application.
 */
#[Fillable(['listing_id', 'donor_id', 'animal_id', 'adopter_id'])]
#[Hidden(['locked_listing_id'])]
class Adoption extends Model
{
    /** @use HasFactory<AdoptionFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => AdoptionStatus::class,
            'completed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Listing, $this>
     */
    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function donor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'donor_id');
    }

    /**
     * @return BelongsTo<Animal, $this>
     */
    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function adopter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'adopter_id');
    }

    /**
     * @return HasMany<Review, $this>
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
