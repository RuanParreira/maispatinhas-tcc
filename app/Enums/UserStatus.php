<?php

namespace App\Enums;

enum UserStatus: string
{
    case Ativo = 'ativo';
    case Suspenso = 'suspenso';
    case Banido = 'banido';
}
