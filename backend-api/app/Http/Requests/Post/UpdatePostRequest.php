<?php

namespace App\Http\Requests\Post;

use App\Enums\PostType;
use App\Models\Post;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;
use Illuminate\Validation\Validator;
use App\Http\Requests\Animal\StoreAnimalRequest;
use Illuminate\Support\Facades\Gate;

class UpdatePostRequest extends FormRequest
{
    /**
     * Só o dono (ou admin) edita. Checado aqui, e não no controller, para quem não é
     * dono receber 403 antes da validação (que revelaria os ids das fotos do post).
     */
    public function authorize(): bool
    {
        return Gate::authorize('update', $this->route('post'))->allowed();
    }


    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Post $post */
        $post = $this->route('post');

        // Mesmas regras do cadastro do animal, mas todos os campos são opcionais na edição.
        $animalRules = collect((new StoreAnimalRequest)->rules())
            ->mapWithKeys(fn($rules, $field) => ["animal.$field" => ['sometimes', ...$rules]])
            ->all();

        return [
            'animal' => ['sometimes', 'array'],
            ...$animalRules,

            // animal_id não entra: não deve mudar após a criação.
            'type' => ['sometimes', Rule::enum(PostType::class)],
            'title' => ['sometimes', 'string', 'max:120'],
            'description' => ['sometimes', 'string'],
            'municipality_id' => ['sometimes', 'integer', 'exists:municipalities,ibge_code'],
            'occurred_at' => ['sometimes', 'nullable', 'date', 'before_or_equal:today'],

            'images' => ['sometimes', 'array', 'max:5'],
            'images.*' => [
                File::image()
                    ->types(['jpg', 'jpeg', 'png', 'webp'])
                    ->max(5 * 1024)
                    ->dimensions(
                        Rule::dimensions()
                            ->minWidth(300)
                            ->minHeight(300)
                            ->maxWidth(6000)
                            ->maxHeight(6000)
                    ),
            ],

            'delete_photo_ids' => ['sometimes', 'array', 'max:5'],
            'delete_photo_ids.*' => [
                'integer',
                'distinct',
                Rule::exists('post_files', 'id')
                    ->where('post_id', $post->id)
                    ->withoutTrashed(),
            ],
        ];
    }

    /**
     * Valida regras que dependem do estado atual do post.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                /** @var Post $post */
                $post = $this->route('post');

                $type = $this->input('type', $post->type->value);
                $occurredAt = $this->has('occurred_at')
                    ? $this->input('occurred_at')
                    : $post->occurred_at?->toDateString();

                if (in_array($type, ['lost', 'found'], true) && blank($occurredAt)) {
                    $validator->errors()->add(
                        'occurred_at',
                        'A data do ocorrido é obrigatória para posts de animal perdido ou encontrado.'
                    );
                }

                if ($type === 'adoption' && filled($occurredAt)) {
                    $validator->errors()->add(
                        'occurred_at',
                        'A data do ocorrido só pode ser informada para posts de animal perdido ou encontrado.'
                    );
                }

                $deletedCount = count($this->input('delete_photo_ids', []));
                $newPhotosCount = count($this->file('images', []));

                if (($post->files()->count() - $deletedCount + $newPhotosCount) > 5) {
                    $validator->errors()->add(
                        'images',
                        'O post pode ter no máximo 5 fotos.'
                    );
                }
            },
        ];
    }
}
