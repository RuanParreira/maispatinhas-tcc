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
 * locked_post_id is a generated column, never written by the application.
 * donor and animal are not stored here: read them through the post relation
 * ($adoption->post->user, $adoption->post->animal), which posts.fillable keeps immutable.
 */
#[Fillable(['post_id', 'adopter_id'])]
#[Hidden(['locked_post_id'])]
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
     * @return BelongsTo<Post, $this>
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
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
