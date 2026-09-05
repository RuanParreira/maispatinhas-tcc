<?php

namespace App\Enums;

enum ModerationAction: string
{
    case Aprovacao = 'aprovacao';
    case Rejeicao = 'rejeicao';
}
