<?php

namespace App\Actions;

use Closure;
use Illuminate\Http\UploadedFile;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Interfaces\ImageInterface;
use Intervention\Image\Laravel\Facades\Image;

/**
 * O upload é recodificado em vez de salvo como veio: isso remove o Exif
 * (fotos de celular carregam a posição GPS de onde foram tiradas), qualquer
 * dado escondido após os pixels e o peso extra. Quem chama decide como a
 * imagem é redimensionada (corte quadrado no avatar, escala limitada no post).
 */
class EncodeImageAsWebp
{
    private const QUALITY = 80;

    /**
     * @param  Closure(ImageInterface): ImageInterface  $resize
     */
    public function handle(UploadedFile $upload, Closure $resize): string
    {
        $image = Image::decode($upload)->removeAnimation();

        return (string) $resize($image)->encode(new WebpEncoder(quality: self::QUALITY, strip: true));
    }
}
