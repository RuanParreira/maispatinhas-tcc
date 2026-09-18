<?php

namespace App\Enums;

enum ListingType: string
{
    case Adoption = 'adoption';
    case Lost = 'lost';
    case Found = 'found';
}
