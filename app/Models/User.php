<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * O usuário nunca é apagado quando tem histórico: a saída da plataforma é
 * anonimização, registrada em `anonymized_at`.
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property UserRole $role
 * @property UserStatus $status
 * @property Carbon|null $last_login_at
 * @property Carbon|null $anonymized_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'phone', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'status' => UserStatus::class,
            'last_login_at' => 'datetime',
            'anonymized_at' => 'datetime',
        ];
    }

    /**
     * Get the user's initials
     */
    public function initials(): string
    {
        $initials = Str::initials($this->name, true);

        return Str::length($initials) > 1
            ? Str::substr($initials, 0, 1).Str::substr($initials, -1)
            : $initials;
    }

    /**
     * @return HasMany<Address, $this>
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    /**
     * @return HasMany<Animal, $this>
     */
    public function animals(): HasMany
    {
        return $this->hasMany(Animal::class);
    }

    /**
     * @return HasMany<Post, $this>
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Posts que este usuário aprovou como moderador.
     *
     * @return HasMany<Post, $this>
     */
    public function approvedPosts(): HasMany
    {
        return $this->hasMany(Post::class, 'approved_by');
    }

    /**
     * @return HasMany<Moderation, $this>
     */
    public function moderations(): HasMany
    {
        return $this->hasMany(Moderation::class, 'moderator_id');
    }

    /**
     * @return HasMany<Adoption, $this>
     */
    public function adoptionsAsDonor(): HasMany
    {
        return $this->hasMany(Adoption::class, 'donor_id');
    }

    /**
     * @return HasMany<Adoption, $this>
     */
    public function adoptionsAsAdopter(): HasMany
    {
        return $this->hasMany(Adoption::class, 'adopter_id');
    }

    /**
     * @return HasMany<Conversation, $this>
     */
    public function conversationsAsAdvertiser(): HasMany
    {
        return $this->hasMany(Conversation::class, 'advertiser_id');
    }

    /**
     * @return HasMany<Conversation, $this>
     */
    public function conversationsAsInterested(): HasMany
    {
        return $this->hasMany(Conversation::class, 'interested_id');
    }

    /**
     * @return HasMany<Message, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * Avaliações que este usuário escreveu.
     *
     * @return HasMany<Review, $this>
     */
    public function reviewsWritten(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    /**
     * Avaliações que este usuário recebeu.
     *
     * @return HasMany<Review, $this>
     */
    public function reviewsReceived(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewee_id');
    }
}
