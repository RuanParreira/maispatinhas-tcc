<?php

namespace App\Enums;

enum AnimalSpecies: string
{
    case Cachorro = 'cachorro';
    case Gato = 'gato';
    case Ave = 'ave';
    case Roedor = 'roedor';
    case Coelho = 'coelho';
    case Outro = 'outro';
}
