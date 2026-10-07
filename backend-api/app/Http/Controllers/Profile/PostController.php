<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostCardResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    /**
     * Anúncios publicados do usuário, mais recentes primeiro. Os que estão em
     * moderação ou encerrados só aparecem para o dono, em "Meus anúncios".
     */
    public function index(User $user): AnonymousResourceCollection
    {
        $posts = $user->posts()
            ->active()
            ->with(['animal', 'municipality:ibge_code,name,state', 'cover'])
            ->latest('published_at')
            ->paginate(9);

        return PostCardResource::collection($posts);
    }
}
