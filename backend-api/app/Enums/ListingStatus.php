<?php

namespace App\Enums;

enum ListingStatus: string
{
    case Draft = 'draft';
    case PendingApproval = 'pending_approval';
    case Rejected = 'rejected';
    case Active = 'active';
    case Paused = 'paused';
    case Expired = 'expired';
    case Resolved = 'resolved';
    case Closed = 'closed';
    case Canceled = 'canceled';
}
