'use client';

import React from 'react';
import {
  ActiveIcon,
  PendingIcon,
  RejectIcon,
  ApprovalIcon,
} from '@/components/Icons/DashboardIcons';

export type BadgeStatus =
  | 'confirmed'
  | 'pending'
  | 'new'
  | 'approved'
  | 'rejected'
  | 'active'
  | 'scheduled'
  | 'paid'
  | 'unpaid'
  | 'under_review'
  | 'completed';

type StatusBadgeProps = {
  status: BadgeStatus;
  label?: string;
  showIcon?: boolean;
};

const statusConfig: Record<
  BadgeStatus,
  {
    label: string;
    bg: string;
    color: string;
    icon: React.ReactNode;
  }
> = {
  confirmed: {
    label: 'Confirmed',
    bg: '#dcfce7',
    color: '#15803d',
    icon: <ApprovalIcon size={13} />,
  },
  approved: {
    label: 'Approved',
    bg: '#dcfce7',
    color: '#15803d',
    icon: <ApprovalIcon size={13} />,
  },
  active: {
    label: 'Active',
    bg: '#dcfce7',
    color: '#15803d',
    icon: <ActiveIcon size={13} />,
  },
  completed: {
    label: 'Completed',
    bg: '#dcfce7',
    color: '#15803d',
    icon: <ApprovalIcon size={13} />,
  },
  pending: {
    label: 'Pending',
    bg: '#f3e8ff',
    color: '#7c3aed',
    icon: <PendingIcon size={13} />,
  },
  under_review: {
    label: 'Under Review',
    bg: '#fff7ed',
    color: '#ea580c',
    icon: <PendingIcon size={13} />,
  },
  scheduled: {
    label: 'Scheduled',
    bg: '#eff6ff',
    color: '#2563eb',
    icon: <PendingIcon size={13} />,
  },
  new: {
    label: 'New',
    bg: '#f3e8ff',
    color: '#7c3aed',
    icon: <PendingIcon size={13} />,
  },
  paid: {
    label: 'Paid',
    bg: '#dcfce7',
    color: '#15803d',
    icon: <ApprovalIcon size={13} />,
  },
  unpaid: {
    label: 'Unpaid',
    bg: '#fff7ed',
    color: '#ea580c',
    icon: <PendingIcon size={13} />,
  },
  rejected: {
    label: 'Rejected',
    bg: '#fee2e2',
    color: '#dc2626',
    icon: <RejectIcon size={13} />,
  },
};

export default function StatusBadge({
  status,
  label,
  showIcon = true,
}: StatusBadgeProps) {
  const item = statusConfig[status];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '5px 9px',
        borderRadius: 999,
        background: item.bg,
        color: item.color,
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {showIcon && item.icon}
      {label || item.label}
    </span>
  );
}