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
        PostStatus::Draft,
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

            // Solicitações nos posts do usuário são recusadas; as aceitas são canceladas.
            Adoption::whereIn('post_id', $postIds)
                ->where('status', AdoptionStatus::Requested)
                ->update(['status' => AdoptionStatus::Refused]);

            Adoption::whereIn('post_id', $postIds)
                ->where('status', AdoptionStatus::InProgress)
                ->update(['status' => AdoptionStatus::Canceled]);

            // As solicitações do próprio usuário, aceitas ou não, são retiradas.
            Adoption::where('adopter_id', $user->id)
                ->whereIn('status', [AdoptionStatus::Requested, AdoptionStatus::InProgress])
                ->update(['status' => AdoptionStatus::Canceled]);

            // Posts resolvidos e encerrados ficam como histórico.
            Post::withTrashed()
                ->whereIn('id', $postIds)
                ->whereIn('status', self::OPEN_POST_STATUSES)
                ->update(['status' => PostStatus::Canceled]);

            // As mensagens ficam: também são histórico da outra parte.
            Conversation::where(fn ($query) => $query
                ->where('advertiser_id', $user->id)
                ->orWhere('interested_id', $user->id))
                ->where('status', ConversationStatus::Active)
                ->update(['status' => ConversationStatus::Archived]);

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
