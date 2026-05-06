'use client';

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  type AdminUser,
  type AdminUserDetail,
  type AdminUserRole,
  type AdminUserStatus,
  useAdminUser,
  useAdminUsers,
  useRevokeAdminUserSessions,
  useUpdateAdminUser,
} from '@catering-marketplace/query-client';

type UserTab = 'profile' | 'access' | 'sessions';
type UserSort = 'newest' | 'name' | 'role' | 'status' | 'country';

const roles: AdminUserRole[] = [
  'customer',
  'partner',
  'caterer',
  'admin',
  'super_admin',
  'user',
];
const statuses: AdminUserStatus[] = ['pending', 'active', 'suspended'];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [country, setCountry] = useState('');
  const [verified, setVerified] = useState('');
  const [sortBy, setSortBy] = useState<UserSort>('newest');
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [activeTab, setActiveTab] = useState<UserTab>('profile');

  const apiFilters = useMemo(
    () => ({ search: search.trim(), role, status, limit: 100 }),
    [search, role, status]
  );
  const { data: users = [], isLoading, isError } = useAdminUsers(apiFilters);
  const countries = useMemo(
    () => unique(users.map((user) => user.CountryCode).filter(Boolean)),
    [users]
  );

  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = users.filter((user) => {
      const haystack = [
        displayName(user),
        user.Email,
        user.Phone,
        user.CountryCode,
        user.Role,
        user.Status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesVerified =
        !verified ||
        (verified === 'verified'
          ? user.EmailVerified || user.PhoneVerified
          : !user.EmailVerified && !user.PhoneVerified);
      return (
        (!term || haystack.includes(term)) &&
        (!role || user.Role === role) &&
        (!status || user.Status === status) &&
        (!country || user.CountryCode === country) &&
        matchesVerified
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'name')
        return displayName(a).localeCompare(displayName(b));
      if (sortBy === 'role')
        return String(a.Role).localeCompare(String(b.Role));
      if (sortBy === 'status')
        return String(a.Status).localeCompare(String(b.Status));
      if (sortBy === 'country')
        return String(a.CountryCode || '').localeCompare(
          String(b.CountryCode || '')
        );
      return (
        new Date(b.CreatedAt || 0).getTime() -
        new Date(a.CreatedAt || 0).getTime()
      );
    });
  }, [users, search, role, status, country, verified, sortBy]);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.Status === 'active').length,
      suspended: users.filter((user) => user.Status === 'suspended').length,
      sessions: users.reduce(
        (sum, user) => sum + (user.ActiveSessions || 0),
        0
      ),
    }),
    [users]
  );

  if (selectedUserId) {
    return (
      <UserDetailView
        userId={selectedUserId}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={() => setSelectedUserId(undefined)}
      />
    );
  }

  return (
    <div style={styles.page}>
      <PageHeader
        eyebrow="Admin controls"
        title="Users"
        description="Search, sort, update identity details, manage role/status, verify contacts, and revoke active sessions from one clean workspace."
      />

      <section style={styles.statsGrid}>
        <Stat label="Users" value={stats.total} />
        <Stat label="Active" value={stats.active} />
        <Stat label="Suspended" value={stats.suspended} />
        <Stat label="Active sessions" value={stats.sessions} />
      </section>

      <section style={styles.filterBar}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email, phone, role"
          style={styles.searchInput}
        />
        <Select
          value={role}
          onChange={setRole}
          label="All roles"
          options={roles.map((value) => [value, labelize(value)])}
        />
        <Select
          value={status}
          onChange={setStatus}
          label="All statuses"
          options={statuses.map((value) => [value, labelize(value)])}
        />
        <Select
          value={country}
          onChange={setCountry}
          label="All countries"
          options={countries.map((value) => [value, value])}
        />
        <Select
          value={verified}
          onChange={setVerified}
          label="Any verification"
          options={[
            ['verified', 'Verified contact'],
            ['unverified', 'Unverified'],
          ]}
        />
        <Select
          value={sortBy}
          onChange={(value) => setSortBy(value as UserSort)}
          label="Sort"
          options={[
            ['newest', 'Newest'],
            ['name', 'Name'],
            ['role', 'Role'],
            ['status', 'Status'],
            ['country', 'Country'],
          ]}
        />
      </section>

      <section style={styles.panel}>
        <div style={styles.panelHeader}>
          <div>
            <h2 style={styles.panelTitle}>User records</h2>
            <p style={styles.panelSub}>
              {visibleUsers.length} matching records
            </p>
          </div>
        </div>
        {isLoading ? (
          <Empty text="Loading users..." />
        ) : isError ? (
          <Empty text="Unable to load users." />
        ) : visibleUsers.length === 0 ? (
          <Empty text="No users match these filters." />
        ) : (
          <div style={styles.table}>
            {visibleUsers.map((user) => (
              <button
                key={user.ID}
                type="button"
                style={styles.userRow}
                onClick={() => {
                  setSelectedUserId(user.ID);
                  setActiveTab('profile');
                }}
              >
                <Avatar user={user} />
                <span style={styles.rowMain}>
                  <strong>{displayName(user)}</strong>
                  <small>{user.Email || user.Phone || user.ID}</small>
                </span>
                <span style={styles.rowCell}>{labelize(user.Role)}</span>
                <span style={styles.rowCell}>{user.CountryCode || '-'}</span>
                <span style={badgeStyle(user.Status)}>
                  {labelize(user.Status)}
                </span>
                <span style={styles.viewLink}>View</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function UserDetailView({
  userId,
  activeTab,
  onTabChange,
  onBack,
}: {
  userId: string;
  activeTab: UserTab;
  onTabChange: (tab: UserTab) => void;
  onBack: () => void;
}) {
  const { data: detail } = useAdminUser(userId);
  const user = detail?.user;

  return (
    <div style={styles.page}>
      <section style={styles.detailHero}>
        <button type="button" onClick={onBack} style={styles.backButton}>
          Back to users
        </button>
        <div style={styles.detailHeroMain}>
          {user ? (
            <Avatar user={user} large />
          ) : (
            <span style={styles.largeAvatar}>U</span>
          )}
          <div>
            <p style={styles.eyebrow}>User 360</p>
            <h1 style={styles.title}>
              {user ? displayName(user) : 'Loading user'}
            </h1>
            <p style={styles.description}>
              {user?.Email || user?.Phone || userId}
            </p>
          </div>
        </div>
        {user?.Status && (
          <span style={badgeStyle(user.Status)}>{labelize(user.Status)}</span>
        )}
      </section>

      <section style={styles.statsGrid}>
        <Stat label="Role" value={user ? labelize(user.Role) : '-'} />
        <Stat label="Country" value={user?.CountryCode || '-'} />
        <Stat
          label="Verified"
          value={
            user && (user.EmailVerified || user.PhoneVerified) ? 'Yes' : 'No'
          }
        />
        <Stat label="Sessions" value={user?.ActiveSessions || 0} />
      </section>

      <nav style={styles.tabs}>
        <Tab
          active={activeTab === 'profile'}
          onClick={() => onTabChange('profile')}
          label="Profile"
        />
        <Tab
          active={activeTab === 'access'}
          onClick={() => onTabChange('access')}
          label="Access"
        />
        <Tab
          active={activeTab === 'sessions'}
          onClick={() => onTabChange('sessions')}
          label={`Sessions (${detail?.sessions?.length || 0})`}
        />
      </nav>

      {!user ? (
        <Empty text="Loading user details..." />
      ) : activeTab === 'profile' ? (
        <ProfileTab user={user} />
      ) : activeTab === 'access' ? (
        <AccessTab user={user} />
      ) : (
        <SessionsTab detail={detail} user={user} />
      )}
    </div>
  );
}

function ProfileTab({ user }: { user: AdminUser }) {
  const updateUser = useUpdateAdminUser();
  const [form, setForm] = useUserForm(user);
  return (
    <section style={styles.panel}>
      <h2 style={styles.panelTitle}>Profile</h2>
      <div style={styles.formGrid}>
        <Field label="Full name">
          <input
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            style={styles.input}
          />
        </Field>
        <Field label="First name">
          <input
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            style={styles.input}
          />
        </Field>
        <Field label="Last name">
          <input
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            style={styles.input}
          />
        </Field>
        <Field label="Email">
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={styles.input}
          />
        </Field>
        <Field label="Phone">
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={styles.input}
          />
        </Field>
        <Field label="Country">
          <input
            value={form.country_code}
            onChange={(e) =>
              setForm({ ...form, country_code: e.target.value.toUpperCase() })
            }
            style={styles.input}
          />
        </Field>
        <Field label="Avatar URL">
          <input
            value={form.avatar_url}
            onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
            style={styles.input}
          />
        </Field>
      </div>
      <button
        type="button"
        onClick={() => updateUser.mutate({ userId: user.ID, ...form })}
        disabled={updateUser.isPending}
        style={styles.primaryButton}
      >
        {updateUser.isPending ? 'Saving...' : 'Save profile'}
      </button>
    </section>
  );
}

function AccessTab({ user }: { user: AdminUser }) {
  const updateUser = useUpdateAdminUser();
  const [form, setForm] = useUserForm(user);
  return (
    <section style={styles.panel}>
      <h2 style={styles.panelTitle}>Access & Verification</h2>
      <div style={styles.formGrid}>
        <Field label="Role">
          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as AdminUserRole })
            }
            style={styles.input}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {labelize(role)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as AdminUserStatus })
            }
            style={styles.input}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {labelize(status)}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div style={styles.toggleRow}>
        <label style={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={form.email_verified}
            onChange={(e) =>
              setForm({ ...form, email_verified: e.target.checked })
            }
          />{' '}
          Email verified
        </label>
        <label style={styles.toggleLabel}>
          <input
            type="checkbox"
            checked={form.phone_verified}
            onChange={(e) =>
              setForm({ ...form, phone_verified: e.target.checked })
            }
          />{' '}
          Phone verified
        </label>
      </div>
      <button
        type="button"
        onClick={() => updateUser.mutate({ userId: user.ID, ...form })}
        disabled={updateUser.isPending}
        style={styles.primaryButton}
      >
        {updateUser.isPending ? 'Saving...' : 'Save access'}
      </button>
    </section>
  );
}

function SessionsTab({
  detail,
  user,
}: {
  detail?: AdminUserDetail;
  user: AdminUser;
}) {
  const revokeSessions = useRevokeAdminUserSessions();
  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <h2 style={styles.panelTitle}>Sessions</h2>
          <p style={styles.panelSub}>
            Revoke active sessions to force the user to sign in again.
          </p>
        </div>
        <button
          type="button"
          onClick={() => revokeSessions.mutate(user.ID)}
          disabled={revokeSessions.isPending || user.ActiveSessions === 0}
          style={styles.dangerButton}
        >
          {revokeSessions.isPending
            ? 'Revoking...'
            : `Revoke sessions (${user.ActiveSessions})`}
        </button>
      </div>
      {!detail?.sessions?.length ? (
        <Empty text="No tracked sessions." />
      ) : (
        <div style={styles.table}>
          {detail.sessions.map((session) => (
            <div key={session.ID} style={styles.sessionRow}>
              <span style={styles.rowMain}>
                <strong>{session.DeviceInfo || 'Unknown device'}</strong>
                <small>
                  {session.IPAddress || 'No IP'} •{' '}
                  {session.Location || 'No location'}
                </small>
              </span>
              <span
                style={badgeStyle(session.IsActive ? 'active' : 'suspended')}
              >
                {session.IsActive ? 'Active' : 'Logged out'}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function useUserForm(user: AdminUser) {
  const [form, setForm] = useState(() => userToForm(user));
  useEffect(() => setForm(userToForm(user)), [user]);
  return [form, setForm] as const;
}

function userToForm(user: AdminUser) {
  return {
    first_name: user.FirstName || '',
    last_name: user.LastName || '',
    full_name: user.FullName || '',
    email: user.Email || '',
    phone: user.Phone || '',
    country_code: user.CountryCode || '',
    role: (user.Role || 'customer') as AdminUserRole,
    status: (user.Status || 'pending') as AdminUserStatus,
    email_verified: Boolean(user.EmailVerified),
    phone_verified: Boolean(user.PhoneVerified),
    avatar_url: user.AvatarURL || '',
  };
}

function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section style={styles.header}>
      <p style={styles.eyebrow}>{eyebrow}</p>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.description}>{description}</p>
    </section>
  );
}

function Select({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: Array<[string, string]>;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={styles.select}
    >
      <option value="">{label}</option>
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  );
}

function Tab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...styles.tab, ...(active ? styles.tabActive : null) }}
    >
      {label}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={styles.field}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <article style={styles.statCard}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={styles.empty}>{text}</div>;
}

function Avatar({ user, large = false }: { user: AdminUser; large?: boolean }) {
  const size = large ? 58 : 40;
  return user.AvatarURL ? (
    <img
      src={user.AvatarURL}
      alt=""
      style={{ ...styles.avatar, width: size, height: size }}
    />
  ) : (
    <span style={{ ...styles.avatar, width: size, height: size }}>
      {initials(displayName(user))}
    </span>
  );
}

function displayName(user: AdminUser) {
  return (
    user.FullName ||
    [user.FirstName, user.LastName].filter(Boolean).join(' ') ||
    user.Email ||
    user.Phone ||
    'User'
  );
}

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function initials(value: string) {
  return value.trim().slice(0, 2).toUpperCase();
}

function labelize(value?: string) {
  return (value || 'unknown')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function badgeStyle(status?: string): React.CSSProperties {
  const tones: Record<string, React.CSSProperties> = {
    active: { background: '#ecfdf5', color: '#047857', borderColor: '#bbf7d0' },
    pending: {
      background: '#fff7ed',
      color: '#c2410c',
      borderColor: '#fed7aa',
    },
    suspended: {
      background: '#fef2f2',
      color: '#b91c1c',
      borderColor: '#fecaca',
    },
  };
  return { ...styles.badge, ...(tones[status || 'pending'] || tones.pending) };
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 18, color: '#111827' },
  header: {
    padding: 24,
    borderRadius: 8,
    background: '#fff',
    border: '1px solid #e5e7eb',
    boxShadow: '0 12px 28px rgba(15,23,42,.05)',
  },
  detailHero: {
    padding: 22,
    borderRadius: 8,
    background: '#fff',
    border: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  detailHeroMain: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    minWidth: 0,
  },
  eyebrow: {
    margin: '0 0 8px',
    color: '#ef4d2f',
    fontSize: 12,
    fontWeight: 850,
    textTransform: 'uppercase',
  },
  title: { margin: 0, fontSize: 28, fontWeight: 850 },
  description: {
    maxWidth: 860,
    margin: '8px 0 0',
    color: '#64748b',
    fontSize: 15,
    lineHeight: 1.6,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
    gap: 12,
  },
  statCard: {
    padding: 16,
    borderRadius: 8,
    background: '#fff',
    border: '1px solid #e5e7eb',
    display: 'grid',
    gap: 6,
  },
  filterBar: {
    display: 'grid',
    gridTemplateColumns: 'minmax(230px,1fr) repeat(5, minmax(145px, 180px))',
    gap: 10,
    padding: 14,
    borderRadius: 8,
    background: '#fff',
    border: '1px solid #e5e7eb',
  },
  searchInput: {
    height: 42,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    padding: '0 12px',
    fontSize: 14,
  },
  select: {
    height: 42,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    padding: '0 10px',
    background: '#fff',
    fontSize: 14,
  },
  panel: {
    padding: 18,
    borderRadius: 8,
    background: '#fff',
    border: '1px solid #e5e7eb',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  panelTitle: { margin: 0, fontSize: 18, fontWeight: 850 },
  panelSub: { margin: '5px 0 0', color: '#64748b', fontSize: 13 },
  table: { display: 'grid', gap: 8 },
  userRow: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '44px minmax(240px,1fr) 140px 100px auto 70px',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    border: '1px solid #eef2f7',
    borderRadius: 8,
    background: '#fff',
    textAlign: 'left',
    cursor: 'pointer',
  },
  sessionRow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(240px,1fr) auto',
    gap: 12,
    alignItems: 'center',
    padding: 12,
    border: '1px solid #eef2f7',
    borderRadius: 8,
  },
  rowMain: { display: 'grid', gap: 4, minWidth: 0 },
  rowCell: { color: '#475569', fontSize: 13, fontWeight: 700 },
  avatar: {
    borderRadius: 999,
    display: 'grid',
    placeItems: 'center',
    background: '#fee2e2',
    color: '#ef4d2f',
    fontWeight: 850,
    objectFit: 'cover',
  },
  largeAvatar: {
    width: 58,
    height: 58,
    borderRadius: 999,
    display: 'grid',
    placeItems: 'center',
    background: '#fee2e2',
    color: '#ef4d2f',
    fontWeight: 850,
    fontSize: 18,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
    padding: '0 8px',
    border: '1px solid',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  viewLink: { color: '#ef4d2f', fontSize: 13, fontWeight: 850 },
  backButton: {
    height: 36,
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    background: '#fff',
    padding: '0 12px',
    color: '#334155',
    fontWeight: 800,
    cursor: 'pointer',
  },
  tabs: {
    display: 'flex',
    gap: 8,
    padding: 6,
    borderRadius: 8,
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    overflowX: 'auto',
  },
  tab: {
    height: 38,
    border: 0,
    borderRadius: 7,
    background: 'transparent',
    padding: '0 14px',
    color: '#475569',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    background: '#fff',
    color: '#ef4d2f',
    boxShadow: '0 8px 20px rgba(15,23,42,.08)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
    gap: 12,
  },
  field: {
    display: 'grid',
    gap: 6,
    color: '#475569',
    fontSize: 12,
    fontWeight: 800,
  },
  input: {
    height: 40,
    border: '1px solid #d1d5db',
    borderRadius: 8,
    padding: '0 10px',
    fontSize: 14,
    background: '#fff',
  },
  toggleRow: { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 14 },
  toggleLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: '#334155',
    fontSize: 14,
    fontWeight: 750,
  },
  primaryButton: {
    marginTop: 16,
    height: 40,
    border: 0,
    borderRadius: 8,
    padding: '0 16px',
    background: '#ef4d2f',
    color: '#fff',
    fontWeight: 850,
    cursor: 'pointer',
  },
  dangerButton: {
    height: 40,
    border: '1px solid #fecaca',
    borderRadius: 8,
    padding: '0 16px',
    background: '#fff',
    color: '#b91c1c',
    fontWeight: 850,
    cursor: 'pointer',
  },
  empty: {
    minHeight: 180,
    display: 'grid',
    placeItems: 'center',
    color: '#64748b',
    background: '#f8fafc',
    border: '1px dashed #cbd5e1',
    borderRadius: 8,
    fontWeight: 750,
  },
};
