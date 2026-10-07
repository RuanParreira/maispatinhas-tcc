<?php

namespace App\Http\Requests\Animal;

use App\Enums\AnimalSex;
use App\Enums\AnimalSize;
use App\Enums\AnimalSpecies;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAnimalRequest extends FormRequest
{
    /**
     * Define se o usuário pode fazer esta requisição.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Regras de validação da requisição.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:60'],
            'species' => ['required', Rule::enum(AnimalSpecies::class)],
            'breed' => ['required', 'string', 'max:60'],
            'sex' => ['required', Rule::enum(AnimalSex::class)],
            'size' => ['required', Rule::enum(AnimalSize::class)],
            'color' => ['required', 'string', 'max:60'],
            'distinctive_features' => ['required', 'string'],
            'approximate_birth_date' => ['required', 'date', 'before_or_equal:today'],
            'vaccinated' => ['required', 'boolean'],
            'dewormed' => ['required', 'boolean'],
            'neutered' => ['required', 'boolean'],
        ];
    }
}
