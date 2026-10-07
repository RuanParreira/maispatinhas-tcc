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
 * status e completed_at não são fillable: seguem o fluxo da adoção.
 * locked_post_id é uma coluna gerada, nunca escrita pela aplicação.
 * doador e animal não ficam aqui: são lidos pela relação com o post
 * ($adoption->post->user, $adoption->post->animal), que o fillable de posts mantém imutáveis.
 */
#[Fillable(['post_id', 'adopter_id'])]
#[Hidden(['locked_post_id'])]
class Adoption extends Model
{
    /** @use HasFactory<AdoptionFactory> */
    use HasFactory;

    /**
     * Atributos convertidos automaticamente (casts).
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
