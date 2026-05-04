'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Check, Copy, Share2 } from 'lucide-react';
import {
  useAccountNotifications,
  useMarkAccountNotificationRead,
  useMarkAllAccountNotificationsRead,
  type AccountNotificationItem,
} from '@catering-marketplace/query-client';

import FirebaseNotificationRegistration from '@/components/notifications/FirebaseNotificationRegistration';
import {
  HomeIcon,
  CalendarIcon,
  OrdersIcon,
  ServicesIcon,
  EarningsIcon,
  ReviewsIcon,
  MessagesIcon,
  AnalyticsIcon,
  SettingsIcon,
  ApprovalIcon,
  PendingIcon,
  WorkersIcon,
  BellIcon,
  MenuIcon,
  ChevronDownIcon,
} from '@/components/Icons/DashboardIcons';
import Breadcrumbs from '@/components/dashboard/BreadCrumbs';

type PartnerDashboardLayoutProps = {
  children: React.ReactNode;
  userName?: string;
  avatarUrl?: string;
  activeKey?: string;
};

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
};

type AccountRole = 'customer' | 'partner' | 'admin' | 'super_admin';

const partnerNavItems: NavItem[] = [
  {
    key: 'home',
    label: 'Home',
    href: '/partner',
    icon: <HomeIcon />,
  },
  {
    key: 'bookings',
    label: 'Bookings',
    href: '/partner/bookings',
    icon: <CalendarIcon />,
  },
  {
    key: 'orders',
    label: 'Orders',
    href: '/partner/orders',
    icon: <OrdersIcon />,
  },
  {
    key: 'services',
    label: 'Services',
    href: '/partner/services',
    icon: <ServicesIcon />,
  },
  {
    key: 'earnings',
    label: 'Earnings',
    href: '/partner/earnings',
    icon: <EarningsIcon />,
  },
  {
    key: 'reviews',
    label: 'Reviews',
    href: '/partner/reviews',
    icon: <ReviewsIcon />,
  },
  {
    key: 'messages',
    label: 'Messages',
    href: '/partner/messages',
    icon: <MessagesIcon />,
    badge: 3,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    href: '/partner/analytics',
    icon: <AnalyticsIcon />,
  },
  {
    key: 'workers',
    label: 'Event Workers',
    href: '/partner/workers',
    icon: <WorkersIcon />,
  },
  {
    key: 'settings',
    label: 'Settings',
    href: '/partner/settings',
    icon: <SettingsIcon />,
  },
];

const customerNavItems: NavItem[] = [
  {
    key: 'home',
    label: 'Home',
    href: '/customer',
    icon: <HomeIcon />,
  },
  {
    key: 'bookings',
    label: 'Bookings',
    href: '/customer/bookings',
    icon: <CalendarIcon />,
  },
  {
    key: 'orders',
    label: 'Orders',
    href: '/customer/orders',
    icon: <OrdersIcon />,
  },
  {
    key: 'messages',
    label: 'Messages',
    href: '/customer/messages',
    icon: <MessagesIcon />,
  },
  {
    key: 'reviews',
    label: 'Reviews',
    href: '/customer/reviews',
    icon: <ReviewsIcon />,
  },
  {
    key: 'profile',
    label: 'Profile',
    href: '/customer/profile',
    icon: <SettingsIcon />,
  },
];

const adminNavItems: NavItem[] = [
  {
    key: 'home',
    label: 'Admin Home',
    href: '/admin',
    icon: <HomeIcon />,
  },
  {
    key: 'users',
    label: 'Users',
    href: '/admin/users',
    icon: <WorkersIcon />,
  },
  {
    key: 'partners',
    label: 'Partners',
    href: '/admin/partners',
    icon: <ApprovalIcon />,
  },
  {
    key: 'approvals',
    label: 'Approvals',
    href: '/admin/approvals',
    icon: <PendingIcon />,
  },
  {
    key: 'service-approvals',
    label: 'Service Approvals',
    href: '/admin/service-approvals',
    icon: <ServicesIcon />,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    href: '/admin/analytics',
    icon: <AnalyticsIcon />,
  },
  {
    key: 'settings',
    label: 'Settings',
    href: '/admin/settings',
    icon: <SettingsIcon />,
  },
];

const navItemsByRole: Record<AccountRole, NavItem[]> = {
  customer: customerNavItems,
  partner: partnerNavItems,
  admin: adminNavItems,
  super_admin: adminNavItems,
};

const roleHomePath: Record<AccountRole, string> = {
  customer: '/customer',
  partner: '/partner',
  admin: '/admin',
  super_admin: '/admin',
};

function normalizeAccountRole(role?: string | null): AccountRole {
  if (role === 'customer') return 'customer';
  if (role === 'admin') return 'admin';
  if (role === 'super_admin') return 'super_admin';
  return 'partner';
}

function getRouteAccountRole(pathname: string): AccountRole | null {
  if (pathname === '/customer' || pathname.startsWith('/customer/')) {
    return 'customer';
  }

  if (pathname === '/partner' || pathname.startsWith('/partner/')) {
    return 'partner';
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return 'admin';
  }

  return null;
}

function formatNotificationTime(value?: string | null) {
  if (!value) return '';

  const createdAt = new Date(value).getTime();
  if (Number.isNaN(createdAt)) return '';

  const diffMs = Date.now() - createdAt;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60_000));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(value));
}

function getNotificationHref(
  notification: AccountNotificationItem,
  accountHomePath: string,
  isAdminAccount: boolean
) {
  if (notification.entity_type === 'partner_service') {
    return isAdminAccount ? '/admin/service-approvals' : '/partner/services';
  }

  return `${accountHomePath}/messages`;
}

function buildReferralLink(code: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    'https://droooly.com';

  return `${baseUrl}/login?mode=signup&ref=${encodeURIComponent(code)}`;
}

export default function PartnerDashboardLayout({
  children,
  userName,
  avatarUrl,
  activeKey = 'home',
}: PartnerDashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const menuAreaRef = useRef<HTMLDivElement>(null);
  const notificationQuery = useAccountNotifications(
    { limit: 8 },
    { enabled: status === 'authenticated' }
  );
  const markNotificationRead = useMarkAccountNotificationRead();
  const markAllNotificationsRead = useMarkAllAccountNotificationsRead();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<'notifications' | 'profile' | null>(
    null
  );
  const [copiedReferral, setCopiedReferral] = useState(false);
  const sessionUser = session?.user as
    | {
        fullName?: string | null;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null;
        referralCode?: string | null;
      }
    | undefined;
  const accountRole = normalizeAccountRole(sessionUser?.role);
  const roleNavItems = navItemsByRole[accountRole];
  const accountHomePath = roleHomePath[accountRole];
  const isAdminAccount =
    accountRole === 'admin' || accountRole === 'super_admin';
  const isCustomerAccount = accountRole === 'customer';
  const routeAccountRole = getRouteAccountRole(pathname);
  const canAccessCurrentRoute =
    !routeAccountRole ||
    routeAccountRole === accountRole ||
    (routeAccountRole === 'admin' && accountRole === 'super_admin');
  const displayName =
    sessionUser?.fullName ||
    sessionUser?.name ||
    userName ||
    (isCustomerAccount ? 'Customer' : isAdminAccount ? 'Admin' : 'Partner');
  const displayAvatar = sessionUser?.image || avatarUrl;
  const userInitial =
    displayName.trim().charAt(0).toUpperCase() ||
    (isCustomerAccount ? 'C' : isAdminAccount ? 'A' : 'P');
  const welcomeSubtitle = isCustomerAccount
    ? 'Track your bookings, orders, messages, and reviews.'
    : isAdminAccount
      ? 'Monitor partners, approvals, users, and platform performance.'
      : 'Manage your bookings, orders, services, and event workers.';
  const helpText = isCustomerAccount
    ? 'Our team is here to help with bookings, orders, and account support.'
    : isAdminAccount
      ? 'Our team is here to help with approvals, partners, and platform setup.'
      : 'Our team is here to help with services, bookings, and setup.';
  const accountNotifications = notificationQuery.data?.items ?? [];
  const unreadNotificationCount = notificationQuery.data?.unread_count ?? 0;
  const referralCode = sessionUser?.referralCode || '';
  const referralLink = referralCode ? buildReferralLink(referralCode) : '';
  const isActive = (href: string) => {
    if (href === accountHomePath) return pathname === href;
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        menuAreaRef.current &&
        !menuAreaRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }

    if (status === 'authenticated' && !canAccessCurrentRoute) {
      router.replace(accountHomePath);
    }
  }, [accountHomePath, canAccessCurrentRoute, router, status]);

  const toggleMenu = (menu: 'notifications' | 'profile') => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const navigateFromMenu = (href: string) => {
    setOpenMenu(null);
    router.push(href);
  };

  const openNotification = (notification: AccountNotificationItem) => {
    if (!notification.is_read) {
      markNotificationRead.mutate(notification.id);
    }

    navigateFromMenu(
      getNotificationHref(notification, accountHomePath, isAdminAccount)
    );
  };

  const copyReferralLink = async () => {
    if (!referralLink) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(referralLink);
      } else {
        const input = document.createElement('textarea');
        input.value = referralLink;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.focus();
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }

      setCopiedReferral(true);
      window.setTimeout(() => setCopiedReferral(false), 1800);
    } catch (error) {
      console.error('Failed to copy referral link:', error);
    }
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div style={styles.authGate}>
        <style>{responsiveCss}</style>
        <div style={styles.authGatePanel}>Loading account...</div>
      </div>
    );
  }

  if (!canAccessCurrentRoute) {
    return (
      <div style={styles.authGate}>
        <style>{responsiveCss}</style>
        <div style={styles.authGatePanel}>Redirecting...</div>
      </div>
    );
  }

  return (
    <div style={styles.shell}>
      <style>{responsiveCss}</style>
      <FirebaseNotificationRegistration />

      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsMobileOpen(false)}
          style={styles.overlay}
        />
      )}

      <aside
        className={isMobileOpen ? 'partner-sidebar open' : 'partner-sidebar'}
        style={styles.sidebar}
      >
        <div>
          <div style={styles.logoWrap}>
            <img
              src="https://ckklrguidafoseanzmdk.supabase.co/storage/v1/object/public/assets/logo/logo_rounded.png"
              alt="Droooly"
              style={styles.logo}
            />
          </div>

          <nav style={styles.nav}>
            {roleNavItems.map((item) => {
              const active = isActive(item.href);

              return (
                <button
                  key={item.key}
                  type="button"
                  style={{
                    ...styles.navItem,
                    ...(active ? styles.navItemActive : {}),
                  }}
                  title={item.label}
                  onClick={() => router.push(item.href)}
                >
                  <span
                    style={{
                      ...styles.navIcon,
                      ...(active ? styles.navIconActive : {}),
                    }}
                  >
                    {item.icon}
                  </span>

                  <span style={styles.navLabel}>{item.label}</span>

                  {item.badge && (
                    <span style={styles.navBadge}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div style={styles.helpCard}>
          <div style={styles.helpIcon}>
            <MessagesIcon />
          </div>

          <div>
            <strong style={styles.helpTitle}>Need Help?</strong>
            <p style={styles.helpText}>{helpText}</p>
          </div>

          <button type="button" style={styles.helpButton}>
            Contact Support
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div style={styles.topLeft}>
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsMobileOpen(true)}
              style={styles.mobileMenuButton}
            >
              <MenuIcon />
            </button>

            <div>
              <h1 style={styles.welcomeTitle}>Welcome, {displayName}! 👋</h1>
              <p style={styles.welcomeSubtitle}>{welcomeSubtitle}</p>
            </div>
          </div>

          <div ref={menuAreaRef} style={styles.topActions}>
            <div style={styles.menuWrap}>
              <button
                type="button"
                aria-expanded={openMenu === 'notifications'}
                aria-haspopup="menu"
                style={styles.notificationButton}
                onClick={() => toggleMenu('notifications')}
              >
                <BellIcon />
                {unreadNotificationCount > 0 && (
                  <span style={styles.notificationBadge}>
                    {unreadNotificationCount > 99
                      ? '99+'
                      : unreadNotificationCount}
                  </span>
                )}
              </button>

              {openMenu === 'notifications' && (
                <div style={styles.notificationMenu} role="menu">
                  <div style={styles.dropdownHeader}>
                    <strong style={styles.dropdownTitle}>Notifications</strong>
                    <button
                      type="button"
                      style={styles.dropdownLink}
                      disabled={unreadNotificationCount === 0}
                      onClick={() => markAllNotificationsRead.mutate()}
                    >
                      Mark all read
                    </button>
                  </div>

                  <div style={styles.notificationList}>
                    {notificationQuery.isLoading ? (
                      <div style={styles.notificationEmpty}>
                        Loading notifications...
                      </div>
                    ) : accountNotifications.length === 0 ? (
                      <div style={styles.notificationEmpty}>
                        No notifications yet.
                      </div>
                    ) : (
                      accountNotifications.map((notification) => (
                        <button
                          type="button"
                          key={notification.id}
                          role="menuitem"
                          style={{
                            ...styles.notificationItem,
                            ...(notification.is_read
                              ? styles.notificationItemRead
                              : {}),
                          }}
                          onClick={() => openNotification(notification)}
                        >
                          {!notification.is_read && (
                            <span style={styles.notificationDot} />
                          )}

                          <span style={styles.notificationCopy}>
                            <strong style={styles.notificationTitle}>
                              {notification.title}
                            </strong>
                            <span style={styles.notificationDescription}>
                              {notification.message}
                            </span>
                            <span style={styles.notificationTime}>
                              {formatNotificationTime(notification.created_at)}
                            </span>
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.menuWrap}>
              <button
                type="button"
                aria-expanded={openMenu === 'profile'}
                aria-haspopup="menu"
                style={styles.avatarButton}
                onClick={() => toggleMenu('profile')}
              >
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    style={styles.avatar}
                  />
                ) : (
                  <span style={styles.avatarFallback}>{userInitial}</span>
                )}

                <span className="avatar-name" style={styles.avatarName}>
                  {displayName}
                </span>

                <ChevronDownIcon size={16} />
              </button>

              {openMenu === 'profile' && (
                <div style={styles.profileMenu} role="menu">
                  <div style={styles.profileHeader}>
                    <span style={styles.profileName}>{displayName}</span>
                    {sessionUser?.email && (
                      <span style={styles.profileEmail}>
                        {sessionUser.email}
                      </span>
                    )}
                  </div>

                  {referralCode && (
                    <div style={styles.referralMenuCard}>
                      <div style={styles.referralMenuTop}>
                        <span style={styles.referralMenuIcon}>
                          <Share2 size={16} strokeWidth={2.4} />
                        </span>
                        <div>
                          <strong style={styles.referralMenuTitle}>
                            Invite & Earn
                          </strong>
                          <span style={styles.referralMenuText}>
                            Share your referral link.
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        role="menuitem"
                        title={referralLink}
                        style={styles.referralMenuButton}
                        onClick={copyReferralLink}
                      >
                        <span style={styles.referralMenuCode}>
                          {referralCode}
                        </span>
                        <span style={styles.referralCopyIcon}>
                          {copiedReferral ? (
                            <Check size={15} strokeWidth={2.6} />
                          ) : (
                            <Copy size={15} strokeWidth={2.3} />
                          )}
                        </span>
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    role="menuitem"
                    style={styles.profileMenuItemDanger}
                    onClick={() => {
                      setOpenMenu(null);
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section style={styles.content}>
          <Breadcrumbs />

          {children}
        </section>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: '100vh',
    display: 'flex',
    background:
      'radial-gradient(circle at top left, rgba(124, 58, 237, 0.10), transparent 34%), radial-gradient(circle at top right, rgba(255, 90, 61, 0.06), transparent 28%), #fbf8ff',
    color: '#151126',
  },

  authGate: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fbf8ff',
    color: '#151126',
  },

  authGatePanel: {
    padding: '16px 18px',
    borderRadius: 8,
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.12)',
    boxShadow: '0 14px 30px rgba(17, 24, 39, 0.06)',
    fontSize: 14,
    fontWeight: 800,
  },

  sidebar: {
    width: 235,
    minHeight: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 40,
    padding: '12px 0',
    background: 'rgba(255, 255, 255, 0.94)',
    borderRight: '1px solid rgba(124, 58, 237, 0.12)',
    boxShadow: '14px 0 38px rgba(91, 33, 182, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  logoWrap: {
    padding: '0 6px',
    marginBottom: 0,
  },

  logo: {
    width: 162,
    height: 'auto',
    objectFit: 'contain',
  },

  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },

  navItem: {
    width: '100%',
    minHeight: 48,
    padding: '4px 12px',
    borderRadius: 0,
    border: '1px solid transparent',
    background: 'transparent',
    color: '#4b5563',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'left',
  },

  navItemActive: {
    color: '#6d28d9',
    background:
      'linear-gradient(135deg, rgba(124, 58, 237, 0.13), rgba(255, 90, 61, 0.06))',
    border: '1px solid rgba(124, 58, 237, 0.16)',
    boxShadow: '0 10px 22px rgba(124, 58, 237, 0.09)',
  },

  navIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fafafa',
    color: '#64748b',
    flexShrink: 0,
  },

  navIconActive: {
    color: '#7c3aed',
    background: '#ffffff',
    boxShadow: '0 8px 18px rgba(124, 58, 237, 0.14)',
  },

  navLabel: {
    flex: 1,
  },

  navBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 999,
    background: '#ff5a3d',
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 900,
  },

  helpCard: {
    padding: 16,
    borderRadius: 24,
    background:
      'linear-gradient(135deg, rgba(124, 58, 237, 0.11), rgba(255, 90, 61, 0.07))',
    border: '1px solid rgba(124, 58, 237, 0.14)',
  },

  helpIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    background: '#ffffff',
    color: '#7c3aed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0 8px 18px rgba(124, 58, 237, 0.14)',
  },

  helpTitle: {
    display: 'block',
    fontSize: 14,
    color: '#151126',
    marginBottom: 4,
  },

  helpText: {
    margin: 0,
    fontSize: 12.5,
    color: '#6b7280',
    lineHeight: 1.5,
  },

  helpButton: {
    width: '100%',
    marginTop: 14,
    border: 'none',
    borderRadius: 14,
    padding: '11px 12px',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 850,
    cursor: 'pointer',
    boxShadow: '0 12px 22px rgba(124, 58, 237, 0.2)',
  },

  main: {
    flex: 1,
    marginLeft: 230,
    minWidth: 0,
  },

  topbar: {
    height: 88,
    position: 'sticky',
    top: 0,
    zIndex: 25,
    padding: '0 32px',
    background: 'rgba(255, 255, 255, 0.88)',
    borderBottom: '1px solid rgba(124, 58, 237, 0.12)',
    backdropFilter: 'blur(18px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  topLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },

  mobileMenuButton: {
    display: 'none',
    width: 42,
    height: 42,
    borderRadius: 14,
    border: '1px solid rgba(124, 58, 237, 0.14)',
    background: '#ffffff',
    color: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  welcomeTitle: {
    margin: 0,
    fontSize: 21,
    fontWeight: 600,
    letterSpacing: '-0.03em',
    color: '#151126',
  },

  welcomeSubtitle: {
    margin: '6px 0 0',
    fontSize: 14,
    color: '#6b7280',
  },

  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },

  menuWrap: {
    position: 'relative',
    display: 'inline-flex',
  },

  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 15,
    border: '1px solid rgba(124, 58, 237, 0.12)',
    background: '#ffffff',
    color: '#151126',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 8px 18px rgba(17, 24, 39, 0.04)',
  },

  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 999,
    background: '#ff5a3d',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 900,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #ffffff',
  },

  referralCopyIcon: {
    width: 22,
    height: 22,
    borderRadius: 999,
    background: '#f5f3ff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6d28d9',
    flexShrink: 0,
  },

  avatarButton: {
    height: 46,
    borderRadius: 999,
    border: '1px solid rgba(124, 58, 237, 0.12)',
    background: '#ffffff',
    color: '#151126',
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    padding: '4px 10px 4px 4px',
    cursor: 'pointer',
    boxShadow: '0 8px 18px rgba(17, 24, 39, 0.04)',
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    objectFit: 'cover',
  },

  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 999,
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 900,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarName: {
    fontSize: 13,
    fontWeight: 850,
    color: '#151126',
    maxWidth: 132,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  notificationMenu: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    width: 340,
    maxWidth: 'calc(100vw - 32px)',
    borderRadius: 16,
    border: '1px solid rgba(124, 58, 237, 0.13)',
    background: '#ffffff',
    boxShadow: '0 22px 60px rgba(17, 24, 39, 0.14)',
    padding: 12,
    zIndex: 60,
  },

  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 4px 10px',
    borderBottom: '1px solid #f1f5f9',
  },

  dropdownTitle: {
    fontSize: 14,
    color: '#151126',
  },

  dropdownLink: {
    border: 'none',
    background: 'transparent',
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: 800,
    cursor: 'pointer',
  },

  notificationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    paddingTop: 8,
  },

  notificationItem: {
    width: '100%',
    border: 'none',
    borderRadius: 12,
    background: '#fff7ed',
    padding: 10,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    cursor: 'pointer',
    textAlign: 'left',
  },

  notificationItemRead: {
    background: 'transparent',
  },

  notificationEmpty: {
    padding: '18px 10px',
    color: '#64748b',
    fontSize: 13,
    fontWeight: 700,
    textAlign: 'center',
  },

  notificationDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    background: '#ff5a3d',
    marginTop: 5,
    flexShrink: 0,
  },

  notificationCopy: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },

  notificationTitle: {
    fontSize: 13,
    color: '#151126',
  },

  notificationDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 1.4,
  },

  notificationTime: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: 700,
  },

  profileMenu: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    width: 282,
    borderRadius: 16,
    border: '1px solid rgba(124, 58, 237, 0.13)',
    background: '#ffffff',
    boxShadow: '0 22px 60px rgba(17, 24, 39, 0.14)',
    padding: 8,
    zIndex: 60,
  },

  profileHeader: {
    padding: '10px 10px 12px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },

  profileName: {
    fontSize: 14,
    fontWeight: 850,
    color: '#151126',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  profileEmail: {
    fontSize: 12,
    color: '#64748b',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  referralMenuCard: {
    margin: 8,
    padding: 12,
    borderRadius: 14,
    background: '#fbf8ff',
    border: '1px solid rgba(124, 58, 237, 0.13)',
  },

  referralMenuTop: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
  },

  referralMenuIcon: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: '#ffffff',
    color: '#7c3aed',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 18px rgba(124, 58, 237, 0.10)',
    flexShrink: 0,
  },

  referralMenuTitle: {
    display: 'block',
    fontSize: 13,
    color: '#151126',
  },

  referralMenuText: {
    display: 'block',
    marginTop: 2,
    fontSize: 12,
    color: '#64748b',
  },

  referralMenuButton: {
    width: '100%',
    minHeight: 38,
    border: '1px solid #ddd6fe',
    borderRadius: 11,
    background: '#ffffff',
    color: '#5b21b6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    cursor: 'pointer',
    padding: '7px 8px 7px 12px',
  },

  referralMenuCode: {
    fontSize: 13,
    fontWeight: 900,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    letterSpacing: 0,
  },

  profileMenuItem: {
    width: '100%',
    minHeight: 40,
    border: 'none',
    borderRadius: 10,
    background: 'transparent',
    color: '#334155',
    fontSize: 13,
    fontWeight: 750,
    cursor: 'pointer',
    textAlign: 'left',
    padding: '0 10px',
  },

  profileMenuItemDanger: {
    width: '100%',
    minHeight: 40,
    border: 'none',
    borderRadius: 10,
    background: 'transparent',
    color: '#dc2626',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    textAlign: 'left',
    padding: '0 10px',
  },

  content: {
    padding: 32,
  },

  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 35,
    border: 'none',
    background: 'rgba(15, 23, 42, 0.42)',
  },
};

const responsiveCss = `
  @media (max-width: 1024px) {
    .partner-sidebar {
      transform: translateX(-100%);
      transition: transform 180ms ease;
    }

    .partner-sidebar.open {
      transform: translateX(0);
    }

    .mobile-menu-btn {
      display: inline-flex !important;
    }
  }

  @media (max-width: 1024px) {
    main {
      margin-left: 0 !important;
    }
  }

  @media (max-width: 768px) {
    header {
      height: auto !important;
      min-height: 78px !important;
      padding: 14px 16px !important;
      align-items: flex-start !important;
      gap: 12px !important;
    }

    section {
      padding: 18px !important;
    }

    .partner-sidebar {
      width: 84vw !important;
      max-width: 310px !important;
    }

    .avatar-name {
      display: none !important;
    }

  }

  @media (max-width: 520px) {
    header {
      padding: 12px !important;
    }

    h1 {
      font-size: 17px !important;
    }

    header p {
      font-size: 12px !important;
      max-width: 210px;
      line-height: 1.4;
    }

    section {
      padding: 14px !important;
    }
  }
`;
