<?php

namespace App\Http\Requests\Post;

use App\Enums\PostType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Garante que o animal existe E pertence ao usuário logado!
            'animal_id' => [
                'required',
                'integer',
                Rule::exists('animals', 'id')->where('user_id', $this->user()->id),
            ],
            'type' => ['required', Rule::enum(PostType::class)],
            'title' => ['required', 'string', 'max:120'],
            'description' => ['required', 'string'],
            'municipality_id' => ['required', 'integer', 'exists:municipalities,ibge_code'],

            // occurred_at é obrigatório apenas para animais perdidos ou encontrados
            'occurred_at' => [
                'required_if:type,lost,found',
                'nullable',
                'date',
                'before_or_equal:today',
            ],
        ];
    }
}
