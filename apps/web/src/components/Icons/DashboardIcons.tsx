import React from 'react';

type IconProps = {
  size?: number;
  stroke?: number;
};

const Base = ({
  children,
  size = 20,
  stroke = 1.8,
}: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

/* =======================
   SIDEBAR ICONS
======================= */

export const HomeIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-6v-6H10v6H4a1 1 0 0 1-1-1v-9.5Z" />
  </Base>
);

export const CalendarIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </Base>
);

export const OrdersIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 5h2l2 10h10l2-7H8" />
    <circle cx="10" cy="20" r="1.5" />
    <circle cx="17" cy="20" r="1.5" />
  </Base>
);

export const ServicesIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M5 17h14" />
    <path d="M6 17a6 6 0 0 1 12 0" />
    <path d="M12 7V5" />
    <path d="M4 20h16" />
  </Base>
);

export const EarningsIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 7a2 2 0 0 1 2-2h12v14H6a2 2 0 0 1-2-2V7Z" />
    <path d="M16 12h4v4h-4a2 2 0 0 1 0-4Z" />
  </Base>
);

export const ReviewsIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9Z" />
  </Base>
);

export const MessagesIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 5h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
  </Base>
);

export const AnalyticsIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M5 19V9" />
    <path d="M12 19V5" />
    <path d="M19 19v-7" />
  </Base>
);

export const SettingsIcon = (props: IconProps) => (
  <Base {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12a7.2 7.2 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7.5 7.5 0 0 0-1.7-1L14.5 3h-5l-.3 3a7.5 7.5 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5A7.2 7.2 0 0 0 5 12c0 .3 0 .7.1 1l-2 1.5 2 3.4 2.4-1c.5.4 1.1.8 1.7 1l.3 3h5l.3-3c.6-.2 1.2-.6 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z" />
  </Base>
);

/* =======================
   PARTNER APPROVAL
======================= */

export const ApprovalIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
);

export const RejectIcon = (props: IconProps) => (
  <Base {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 9 6 6M15 9l-6 6" />
  </Base>
);

export const PendingIcon = (props: IconProps) => (
  <Base {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </Base>
);

/* =======================
   EVENT WORKERS
======================= */

export const WorkersIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
    <circle cx="12" cy="7" r="4" />
  </Base>
);

export const ActiveIcon = (props: IconProps) => (
  <Base {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 12 2 2 4-4" />
  </Base>
);

export const BlockedIcon = (props: IconProps) => (
  <Base {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 8h8v8H8z" />
  </Base>
);

/* =======================
   NAVBAR / UI
======================= */

export const BellIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
    <path d="M10 21h4" />
  </Base>
);

export const MenuIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
);

export const ChevronDownIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="m6 9 6 6 6-6" />
  </Base>
);

export const EyeIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </Base>
);

export const EditIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25Z" />
  </Base>
);