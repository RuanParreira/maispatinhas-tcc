<?php

namespace App\Models;

use App\Enums\ConversationStatus;
use Database\Factories\ConversationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['post_id', 'advertiser_id', 'interested_id'])]
class Conversation extends Model
{
    /** @use HasFactory<ConversationFactory> */
    use HasFactory;

    /**
     * Mesmo padrão da migration, para a conversa recém-criada já sair ativa da memória.
     *
     * @var array<string, string>
     */
    protected $attributes = [
        'status' => 'active',
    ];

    /**
     * Atributos convertidos automaticamente (casts).
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ConversationStatus::class,
            'last_message_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Post, $this>
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class)->withTrashed();
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function advertiser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'advertiser_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function interested(): BelongsTo
    {
        return $this->belongsTo(User::class, 'interested_id');
    }

    /**
     * @return HasMany<Message, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * @return HasOne<Message, $this>
     */
    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * Conversas em que o usuário é o anunciante ou o interessado.
     *
     * @param  Builder<Conversation>  $query
     */
    #[Scope]
    protected function involving(Builder $query, User $user): void
    {
        $query->where(fn (Builder $query) => $query
            ->where('advertiser_id', $user->id)
            ->orWhere('interested_id', $user->id));
    }

    public function hasParticipant(User $user): bool
    {
        return in_array($user->id, [$this->advertiser_id, $this->interested_id], true);
    }

    public function otherParticipant(User $user): User
    {
        return $user->id === $this->advertiser_id ? $this->interested : $this->advertiser;
    }
}
