<?php

namespace App\Enums;

enum ModerationAction: string
{
    case Approval = 'approval';
    case Rejection = 'rejection';
}
