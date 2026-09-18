<?php

namespace App\Enums;

enum AdoptionStatus: string
{
    case Requested = 'requested';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Refused = 'refused';
    case Canceled = 'canceled';
}
