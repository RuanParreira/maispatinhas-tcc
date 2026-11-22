<?php

namespace App\Actions;

use App\Enums\AdoptionStatus;
use App\Enums\ConversationStatus;
use App\Enums\PostStatus;
use App\Models\Adoption;
use App\Models\Conversation;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Exclusão de conta. A linha é mantida porque posts, adoções, avaliações e
 * moderações a referenciam com RESTRICT, e um delete físico apagaria em cascata
 * as conversas da outra parte. Os dados pessoais são sobrescritos, o que a
 * LGPD aceita como eliminação.
 */
class AnonymizeUser
{
    private const OPEN_POST_STATUSES = [
        PostStatus::PendingApproval,
        PostStatus::Rejected,
        PostStatus::Active,
        PostStatus::Paused,
        PostStatus::Expired,
    ];

    public function handle(User $user): void
    {
        $avatarPath = $user->avatar_path;

        DB::transaction(function () use ($user) {
            // Posts excluídos também contam: uma adoção em andamento pode apontar para um deles.
            $postIds = $user->posts()->withTrashed()->pluck('id');

            // Adoções aguardando confirmação são canceladas, seja ele o doador ou o adotante.
            Adoption::where('status', AdoptionStatus::InProgress)
                ->where(fn ($query) => $query->whereIn('post_id', $postIds)->orWhere('adopter_id', $user->id))
                ->update(['status' => AdoptionStatus::Canceled]);

            // Posts resolvidos ficam como histórico.
            Post::withTrashed()
                ->whereIn('id', $postIds)
                ->whereIn('status', self::OPEN_POST_STATUSES)
                ->update(['status' => PostStatus::Canceled]);

            // As mensagens ficam: também são histórico da outra parte. Bloqueadas também
            // arquivam, senão quem bloqueou poderia desbloquear e escrever para a conta removida.
            Conversation::query()->involving($user)
                ->whereIn('status', [ConversationStatus::Active, ConversationStatus::Blocked])
                ->update(['status' => ConversationStatus::Archived, 'blocked_by' => null]);

            $user->favoritePosts()->detach();

            DB::table('sessions')->where('user_id', $user->id)->delete();

            // O TLD .invalid é reservado e nunca recebe e-mail; o id mantém o endereço único.
            $user->name = 'Usuário removido';
            $user->email = "removido-{$user->id}@anonimizado.invalid";
            $user->phone = null;
            $user->bio = null;
            $user->avatar_path = null;
            $user->password = Hash::make(Str::random(64));
            $user->remember_token = null;
            $user->email_verified_at = null;
            $user->last_login_at = null;
            $user->anonymized_at = now();
            $user->save();
        });

        // Só depois do commit: um rollback não pode deixar o usuário sem o arquivo.
        if ($avatarPath) {
            Storage::disk('public')->delete($avatarPath);
        }
    }
}
