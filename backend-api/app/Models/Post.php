<?php

namespace App\Models;

use App\Enums\PostStatus;
use App\Enums\PostType;
use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * status, published_at e approved_* não são fillable: só mudam pelo fluxo de moderação.
 * user_id e animal_id também não: são definidos uma vez na criação e as adoções
 * dependem de que nunca mudem (veja a migration de adoptions).
 *
 * @method static Builder<static> active()
 */
#[Fillable([
    'type',
    'title',
    'description',
    'municipality_id',
    'occurred_at',
])]
class Post extends Model
{
    /** @use HasFactory<PostFactory> */
    use HasFactory, SoftDeletes;

    /**
     * Atributos convertidos automaticamente (casts).
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => PostType::class,
            'status' => PostStatus::class,
            'occurred_at' => 'date',
            'published_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    /**
     * Apenas posts visíveis ao público (aprovados e em andamento).
     *
     * @param  Builder<Post>  $query
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->where('status', PostStatus::Active);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Animal, $this>
     */
    public function animal(): BelongsTo
    {
        return $this->belongsTo(Animal::class);
    }

    /**
     * @return BelongsTo<Municipality, $this>
     */
    public function municipality(): BelongsTo
    {
        return $this->belongsTo(Municipality::class, 'municipality_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * @return HasMany<PostFile, $this>
     */
    public function files(): HasMany
    {
        return $this->hasMany(PostFile::class)->orderBy('position');
    }

    /**
     * Primeira foto do post, usada como capa do card.
     *
     * @return HasOne<PostFile, $this>
     */
    public function cover(): HasOne
    {
        return $this->hasOne(PostFile::class)->ofMany('position', 'min');
    }

    /**
     * @return HasMany<Moderation, $this>
     */
    public function moderations(): HasMany
    {
        return $this->hasMany(Moderation::class);
    }

    /**
     * @return HasMany<Adoption, $this>
     */
    public function adoptions(): HasMany
    {
        return $this->hasMany(Adoption::class);
    }

    /**
     * @return HasMany<Conversation, $this>
     */
    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites');
    }
}
