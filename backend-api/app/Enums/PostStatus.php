<?php

namespace App\Enums;

enum PostStatus: string
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

    /**
     * Resolvido, encerrado e cancelado são histórico: não se editam nem se cancelam.
     */
    public function isFinished(): bool
    {
        return in_array($this, [self::Resolved, self::Closed, self::Canceled], true);
    }
}
