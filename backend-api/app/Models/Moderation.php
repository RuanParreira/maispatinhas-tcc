<?php

namespace App\Models;

use App\Enums\ModerationAction;
use Database\Factories\ModerationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Log de auditoria das decisões de moderação, só recebe inserções.
 */
#[Fillable(['post_id', 'moderator_id', 'action', 'reason'])]
class Moderation extends Model
{
    /** @use HasFactory<ModerationFactory> */
    use HasFactory;

    const UPDATED_AT = null;

    /**
     * Atributos convertidos automaticamente (casts).
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'action' => ModerationAction::class,
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
    public function moderator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'moderator_id');
    }
}
