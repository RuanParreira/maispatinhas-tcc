<?php

namespace App\Http\Requests\Post;

use App\Enums\AnimalAgeGroup;
use App\Enums\AnimalSex;
use App\Enums\AnimalSize;
use App\Enums\AnimalSpecies;
use App\Enums\PostStatus;
use App\Enums\PostType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListPostsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Filtros do catálogo público. Todos são opcionais; "search" procura no nome
     * e na raça do animal e no nome da cidade. type aceita vários tipos (perdidos e
     * encontrados dividem a tela) e status=resolved lista os reencontros.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['nullable', 'array'],
            'type.*' => [Rule::enum(PostType::class)],
            'status' => ['nullable', Rule::in([PostStatus::Active->value, PostStatus::Resolved->value])],
            'search' => ['nullable', 'string', 'max:100'],
            'species' => ['nullable', Rule::enum(AnimalSpecies::class)],
            'size' => ['nullable', Rule::enum(AnimalSize::class)],
            'sex' => ['nullable', Rule::enum(AnimalSex::class)],
            'age_group' => ['nullable', Rule::enum(AnimalAgeGroup::class)],
            'sort' => ['nullable', Rule::in(['recent', 'name'])],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
