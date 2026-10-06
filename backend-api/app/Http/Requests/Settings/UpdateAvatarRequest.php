<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class UpdateAvatarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * SVG is left out because it can carry scripts, and the dimension limit
     * keeps a small file from expanding into a huge bitmap when decoded.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'avatar' => [
                'required',
                File::image()
                    ->types(['jpg', 'jpeg', 'png', 'webp'])
                    ->max(5 * 1024)
                    ->dimensions(Rule::dimensions()->minWidth(128)->minHeight(128)->maxWidth(6000)->maxHeight(6000)),
            ],
        ];
    }
}
