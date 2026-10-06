<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateAvatarRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Laravel\Facades\Image;

class AvatarController extends Controller
{
    private const SIZE = 512;

    /**
     * The upload is re-encoded instead of stored as sent: this drops the
     * Exif data (phone photos carry the GPS position of where they were
     * taken), anything hidden after the pixels, and the extra weight.
     * The old file is only deleted after the new path is saved, so a
     * failure midway never leaves the user without a photo.
     */
    public function update(UpdateAvatarRequest $request): JsonResponse
    {
        $user = $request->user();

        $image = Image::decode($request->file('avatar'))
            ->removeAnimation()
            ->cover(self::SIZE, self::SIZE)
            ->encode(new WebpEncoder(quality: 80, strip: true));

        $path = 'avatars/'.Str::uuid().'.webp';
        Storage::disk('public')->put($path, (string) $image);

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
