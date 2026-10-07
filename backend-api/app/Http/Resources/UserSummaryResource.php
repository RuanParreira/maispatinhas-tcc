<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Pessoa citada em outra listagem (adoções, avaliações). removed indica conta
 * anonimizada, cujo perfil responde 404, para o frontend não criar o link.
 *
 * @mixin User
 */
class UserSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'avatar_url' => $this->avatar_url,
            'removed' => $this->anonymized_at !== null,
        ];
    }
}
