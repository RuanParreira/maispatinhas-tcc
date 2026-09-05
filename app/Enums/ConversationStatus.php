<?php

namespace App\Enums;

enum ConversationStatus: string
{
    case Ativa = 'ativa';
    case Arquivada = 'arquivada';
    case Bloqueada = 'bloqueada';
}
