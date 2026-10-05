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
use Illuminate\Support\Str;

/**
 * Account deletion. The row is kept because posts, adoptions, reviews and
 * moderations reference it with RESTRICT, and a hard delete would cascade
 * into the other party's conversations. Personal data is overwritten instead,
 * which the LGPD accepts as elimination.
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
        DB::transaction(function () use ($user) {
            // Trashed posts count too: an adoption in progress may still point to one.
            $postIds = $user->posts()->withTrashed()->pluck('id');

            // Requests on the user's posts are refused; accepted ones are canceled.
            Adoption::whereIn('post_id', $postIds)
                ->where('status', AdoptionStatus::Requested)
                ->update(['status' => AdoptionStatus::Refused]);

            Adoption::whereIn('post_id', $postIds)
                ->where('status', AdoptionStatus::InProgress)
                ->update(['status' => AdoptionStatus::Canceled]);

            // The user's own requests, accepted or not, are withdrawn.
            Adoption::where('adopter_id', $user->id)
                ->whereIn('status', [AdoptionStatus::Requested, AdoptionStatus::InProgress])
                ->update(['status' => AdoptionStatus::Canceled]);

            // Resolved and closed posts stay as history.
            Post::withTrashed()
                ->whereIn('id', $postIds)
                ->whereIn('status', self::OPEN_POST_STATUSES)
                ->update(['status' => PostStatus::Canceled]);

            // Messages stay: they are also the other party's history.
            Conversation::where(fn ($query) => $query
                ->where('advertiser_id', $user->id)
                ->orWhere('interested_id', $user->id))
                ->where('status', ConversationStatus::Active)
                ->update(['status' => ConversationStatus::Archived]);

            $user->favoritePosts()->detach();

            DB::table('sessions')->where('user_id', $user->id)->delete();

            // The .invalid TLD is reserved and never receives mail; the id keeps it unique.
            $user->name = 'Usuário removido';
            $user->email = "removido-{$user->id}@anonimizado.invalid";
            $user->phone = '';
            $user->password = Hash::make(Str::random(64));
            $user->remember_token = null;
            $user->email_verified_at = null;
            $user->last_login_at = null;
            $user->anonymized_at = now();
            $user->save();
        });
    }
}
