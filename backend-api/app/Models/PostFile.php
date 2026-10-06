<?php

namespace App\Models;

use Database\Factories\PostFileFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

#[Fillable(['post_id', 'original_name', 'path', 'disk', 'hash', 'size', 'mime_type', 'position'])]
class PostFile extends Model
{
    /** @use HasFactory<PostFileFactory> */
    use HasFactory, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'size' => 'integer',
            'position' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Post, $this>
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    protected $appends = ['url'];
    public function getUrlAttribute(): string
    {
        return asset(Storage::url($this->path));
    }
}
