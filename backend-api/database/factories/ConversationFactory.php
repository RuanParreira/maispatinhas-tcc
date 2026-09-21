<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Conversation>
 */
class ConversationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'post_id' => Post::factory(),
            'advertiser_id' => fn (array $attributes) => Post::find($attributes['post_id'])->user_id,
            'interested_id' => User::factory(),
        ];
    }
}
