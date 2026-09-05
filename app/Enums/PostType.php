<?php

namespace App\Enums;

enum PostType: string
{
    case Adocao = 'adocao';
    case Perdido = 'perdido';
    case Encontrado = 'encontrado';
}
