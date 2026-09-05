<?php

namespace App\Models;

use App\Enums\AdoptionStatus;
use Database\Factories\AdoptionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * `exclusive_post_id` é coluna gerada pelo banco e nunca deve ser escrita
 * pela aplicação. Ela garante no máximo uma adoção `em_andamento` ou
 * `concluida` por post.
 *
 * @property int $id
 * @property int $post_id
 * @property int $donor_id
 * @property int $animal_id
 * @property int $adopter_id
 * @property AdoptionStatus $status
 * @property Carbon|null $scheduled_at
 * @property int|null $exclusive_post_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['status', 'scheduled_at'])]
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
            'scheduled_at' => 'datetime',
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
     * @return BelongsTo<Animal, $this>
     */
    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }

    /**
     * Quem está doando o animal.
     *
     * @return BelongsTo<User, $this>
     */
    public function donor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'donor_id');
    }

    /**
     * Quem solicitou a adoção.
     *
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
