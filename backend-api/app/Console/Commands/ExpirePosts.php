<?php

namespace App\Console\Commands;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('posts:expire')]
#[Description('Expira os anúncios publicados há mais tempo que o prazo do seu tipo')]
class ExpirePosts extends Command
{
    /**
     * O prazo conta a partir de published_at, que a renovação reinicia.
     */
    public function handle(): void
    {
        $expired = collect(PostType::cases())->sum(
            fn (PostType $type) => Post::active()
                ->where('type', $type)
                ->where('published_at', '<=', now()->subDays($type->daysUntilExpiration()))
                ->update(['status' => PostStatus::Expired])
        );

        $this->info("{$expired} anúncio(s) expirado(s).");
    }
}
