<?php

namespace App\Http\Requests\Post;

use App\Enums\PostType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * As fotos seguem as regras do avatar: SVG fica de fora porque pode carregar scripts,
     * o tamanho mínimo mantém as fotos legíveis e o máximo impede que um arquivo pequeno
     * vire um bitmap enorme ao ser decodificado.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Só animais do próprio usuário: o de outro dono responde igual a um inexistente.
            'animal_id' => [
                'required',
                'integer',
                Rule::exists('animals', 'id')
                    ->where('user_id', $this->user()->id)
                    ->withoutTrashed(),
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

            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => [
                File::image()
                    ->types(['jpg', 'jpeg', 'png', 'webp'])
                    ->max(5 * 1024)
                    ->dimensions(Rule::dimensions()->minWidth(300)->minHeight(300)->maxWidth(6000)->maxHeight(6000)),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'animal_id.exists' => 'Selecione um dos seus animais.',
        ];
    }
}
