<?php

namespace App\Http\Controllers\MyPosts;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

/**
 * "Reencontrei" de perdido e encontrado: o animal voltou para o tutor e o anúncio
 * vira histórico. Adoção não passa por aqui: ela se resolve pela confirmação do "Doei".
 */
class ResolutionController extends Controller
{
    public function store(Post $post): Response
    {
        Gate::authorize('update', $post);

        abort_if($post->type === PostType::Adoption, 409, 'Anúncios de adoção são finalizados pela confirmação da adoção.');
        abort_unless(
            in_array($post->status, [PostStatus::Active, PostStatus::Paused], true),
            409,
            'Só anúncios publicados ou pausados podem ser marcados como resolvidos.'
        );

        $post->status = PostStatus::Resolved;
        $post->save();

        return response()->noContent();
    }
}
