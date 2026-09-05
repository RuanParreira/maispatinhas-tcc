<?php

namespace App\Models;

use App\Enums\ModerationAction;
use Database\Factories\ModerationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Log imutável: cada passagem pela moderação gera uma linha nova, e linha
 * existente nunca é editada. Por isso a tabela só tem `created_at`.
 *
 * @property int $id
 * @property int $post_id
 * @property int $moderator_id
 * @property ModerationAction $action
 * @property string|null $reason
 * @property Carbon|null $created_at
 */
#[Fillable(['action', 'reason'])]
class Moderation extends Model
{
    /** @use HasFactory<ModerationFactory> */
    use HasFactory;

    public const UPDATED_AT = null;

    /**
     * Get the attributes that should be cast.
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
