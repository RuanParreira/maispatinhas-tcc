<?php

namespace App\Http\Controllers\MyPosts;

use App\Enums\PostStatus;
use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

/**
 * Renovar devolve o anúncio expirado ao catálogo sem nova moderação (o conteúdo
 * aprovado não mudou) e reinicia published_at, que é de onde o prazo conta.
 */
class RenewalController extends Controller
{
    public function store(Post $post): Response
    {
        Gate::authorize('update', $post);

        abort_unless($post->status === PostStatus::Expired, 409, 'Só anúncios expirados podem ser renovados.');

        $post->status = PostStatus::Active;
        $post->published_at = now();
        $post->save();

        return response()->noContent();
    }
}
