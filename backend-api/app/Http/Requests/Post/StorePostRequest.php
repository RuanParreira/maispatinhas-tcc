<?php

namespace App\Http\Requests\Post;

use App\Enums\PostType;
use App\Models\Animal;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{

    // usando a police do animal

    public function authorize(): bool
    {
        $animalId = $this->input('animal_id');

        // animal id é obrigatório
        if (!$animalId) {
            return true;
        }

        $animal = Animal::find($animalId);

        // erro 422 (animal não existe)
        if (!$animal) {
            return true;
        }

        return $this->user()->can('update', $animal);
    }

    public function rules(): array
    {
        return [
            'animal_id' => ['required', 'integer', 'exists:animals,id'],
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

            // Validação das imagens (até 5 fotos de até 5MB)
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ];
    }
}
