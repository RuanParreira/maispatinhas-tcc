<?php

namespace App\Enums;

enum AnimalSpecies: string
{
    case Dog = 'dog';
    case Cat = 'cat';
    case Bird = 'bird';
    case Rodent = 'rodent';
    case Rabbit = 'rabbit';
    case Other = 'other';

    /**
     * Espécies que só existem em porte pequeno.
     */
    public function isAlwaysSmall(): bool
    {
        return in_array($this, [self::Bird, self::Rodent, self::Rabbit], true);
    }
}
