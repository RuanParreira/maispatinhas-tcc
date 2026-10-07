<?php

namespace App\Http\Controllers\Settings;

use App\Actions\EncodeImageAsWebp;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateAvatarRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Interfaces\ImageInterface;

class AvatarController extends Controller
{
    private const SIZE = 512;

    /**
     * O arquivo antigo só é apagado depois que o novo caminho é salvo, então
     * uma falha no meio nunca deixa o usuário sem foto.
     */
    public function update(UpdateAvatarRequest $request, EncodeImageAsWebp $encodeImageAsWebp): JsonResponse
    {
        $user = $request->user();

        $image = $encodeImageAsWebp->handle(
            $request->file('avatar'),
            fn (ImageInterface $image) => $image->cover(self::SIZE, self::SIZE),
        );

        $path = 'avatars/'.Str::uuid().'.webp';
        Storage::disk('public')->put($path, $image);

        $oldPath = $user->avatar_path;

        $user->avatar_path = $path;
        $user->save();

        if ($oldPath) {
            Storage::disk('public')->delete($oldPath);
        }

        return response()->json([
            'avatar_url' => $user->avatar_url,
        ]);
    }

    public function destroy(Request $request): Response
    {
        $user = $request->user();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);

            $user->avatar_path = null;
            $user->save();
        }

        return response()->noContent();
    }
}
