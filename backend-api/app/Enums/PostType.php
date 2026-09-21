<?php

namespace App\Enums;

enum PostType: string
{
    case Adoption = 'adoption';
    case Lost = 'lost';
    case Found = 'found';
}
