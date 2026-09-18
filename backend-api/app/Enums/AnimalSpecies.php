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
}
