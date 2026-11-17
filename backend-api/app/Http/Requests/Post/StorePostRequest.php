<?php

namespace App\Http\Requests\Post;

use App\Enums\AnimalSize;
use App\Enums\AnimalSpecies;
use App\Enums\PostType;
use App\Http\Requests\Animal\StoreAnimalRequest;
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
     * O animal chega junto com o post (campos animal.*) e os dois são criados na mesma
     * transação: todo post tem um animal e todo animal pertence a um post.
     * As regras do animal são as mesmas do StoreAnimalRequest, só com o prefixo "animal.".
     * occurred_at é obrigatório para animais perdidos ou encontrados e proibido em adoção;
     * location_reference (bairro ou ponto de referência) é opcional nesses casos e também proibido em adoção.
     * with_finder diz se o animal encontrado ficou com quem o achou: só existe em encontrado.
     * Pet perdido tem tutor, então o nome é obrigatório nesse caso. Quem encontrou
     * o animal não sabe a idade dele, então ela é opcional nesse caso.
     *
     * As fotos seguem as regras do avatar: SVG fica de fora porque pode carregar scripts,
     * o tamanho mínimo mantém as fotos legíveis e o máximo impede que um arquivo pequeno
     * vire um bitmap enorme ao ser decodificado.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $animalRules = collect((new StoreAnimalRequest)->rules())
            ->mapWithKeys(fn ($rules, $field) => ["animal.$field" => $rules])
            ->all();

        return [
            'animal' => ['required', 'array'],
            ...$animalRules,
            'animal.name' => ['required_if:type,lost', ...$animalRules['animal.name']],
            'animal.size' => [
                ...$animalRules['animal.size'],
                Rule::when(
                    AnimalSpecies::tryFrom((string) $this->input('animal.species'))?->isAlwaysSmall() ?? false,
                    [Rule::in([AnimalSize::Small->value])],
                ),
            ],
            'animal.approximate_birth_date' => [
                'required_unless:type,found',
                'nullable',
                ...array_diff($animalRules['animal.approximate_birth_date'], ['required']),
            ],

            'type' => ['required', Rule::enum(PostType::class)],
            'title' => ['required', 'string', 'min:10', 'max:120'],
            'description' => ['required', 'string', 'min:30'],
            'municipality_id' => ['required', 'integer', 'exists:municipalities,ibge_code'],
            'occurred_at' => [
                'required_if:type,lost,found',
                'prohibited_if:type,adoption',
                'nullable',
                'date',
                'before_or_equal:today',
            ],
            'location_reference' => ['prohibited_if:type,adoption', 'nullable', 'string', 'max:120'],
            'with_finder' => ['required_if:type,found', 'prohibited_unless:type,found', 'nullable', 'boolean'],

            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => [
                File::image()
                    ->types(['jpg', 'jpeg', 'png', 'webp'])
                    ->max(5 * 1024)
                    ->dimensions(Rule::dimensions()->minWidth(300)->minHeight(300)->maxWidth(6000)->maxHeight(6000)),
            ],
        ];
    }
}
