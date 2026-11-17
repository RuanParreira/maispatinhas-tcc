<?php

namespace App\Http\Controllers\MyPosts;

use App\Enums\PostStatus;
use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

/**
 * Pausar tira o anúncio do catálogo sem perder a aprovação: retomar volta
 * direto para ATIVO, sem passar de novo pela moderação.
 */
class PauseController extends Controller
{
    public function store(Post $post): Response
    {
        Gate::authorize('update', $post);

        abort_unless($post->status === PostStatus::Active, 409, 'Só anúncios publicados podem ser pausados.');

        $post->status = PostStatus::Paused;
        $post->save();

        return response()->noContent();
    }

    public function destroy(Post $post): Response
    {
        Gate::authorize('update', $post);

        abort_unless($post->status === PostStatus::Paused, 409, 'Só anúncios pausados podem ser retomados.');

        $post->status = PostStatus::Active;
        $post->save();

        return response()->noContent();
    }
}
