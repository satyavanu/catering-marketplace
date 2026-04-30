'use client';

import React from 'react';
import {
  ActiveIcon,
  PendingIcon,
  RejectIcon,
  ApprovalIcon,
} from '@/components/Icons/DashboardIcons';

export type DashboardStatus =
  | 'active'
  | 'draft'
  | 'under_review'
  | 'rejected'
  | 'approved'
  | 'paused';

type Props = {
  status: DashboardStatus;
  label?: string;
};

const config: Record<DashboardStatus, any> = {
  active: {
    label: 'Active',
    bg: '#dcfce7',
    color: '#15803d',
    icon: <ActiveIcon size={13} />,
  },
  approved: {
    label: 'Approved',
    bg: '#dcfce7',
    color: '#15803d',
    icon: <ApprovalIcon size={13} />,
  },
  draft: {
    label: 'Draft',
    bg: '#f1f5f9',
    color: '#64748b',
    icon: <PendingIcon size={13} />,
  },
  under_review: {
    label: 'Under Review',
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
  paused: {
    label: 'Paused',
    bg: '#fef3c7',
    color: '#b45309',
    icon: <PendingIcon size={13} />,
  },
};

export default function DashboardStatusBadge({ status, label }: Props) {
  const item = config[status];

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
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {item.icon}
      {label || item.label}
    </span>
  );
}