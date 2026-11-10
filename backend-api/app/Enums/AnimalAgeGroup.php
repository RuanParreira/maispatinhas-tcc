<?php

namespace App\Enums;

/**
 * Faixas etárias do filtro do catálogo, calculadas a partir de approximate_birth_date:
 * filhote até 1 ano, adulto de 1 a 8 anos, idoso a partir de 8 anos.
 */
enum AnimalAgeGroup: string
{
    case Young = 'young';
    case Adult = 'adult';
    case Senior = 'senior';
}
