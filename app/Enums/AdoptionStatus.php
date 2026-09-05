<?php

namespace App\Enums;

enum AdoptionStatus: string
{
    case Solicitada = 'solicitada';
    case EmAndamento = 'em_andamento';
    case Concluida = 'concluida';
    case Recusada = 'recusada';
    case Cancelada = 'cancelada';
}
