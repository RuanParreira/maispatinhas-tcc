<?php

namespace App\Enums;

enum PostType: string
{
    case Adoption = 'adoption';
    case Lost = 'lost';
    case Found = 'found';

    /**
     * Dias no ar até expirar. Perdido e encontrado ficam desatualizados mais rápido.
     */
    public function daysUntilExpiration(): int
    {
        return match ($this) {
            self::Adoption => 60,
            self::Lost, self::Found => 30,
        };
    }
}
