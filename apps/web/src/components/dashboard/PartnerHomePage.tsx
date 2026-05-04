'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Check, Copy, Share2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import {
  CalendarIcon,
  EarningsIcon,
  OrdersIcon,
  ReviewsIcon,
  ServicesIcon,
  WorkersIcon,
  ApprovalIcon,
} from '@/components/Icons/DashboardIcons';

function buildReferralLink(code: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    'https://droooly.com';

  return `${baseUrl}/login?mode=signup&ref=${encodeURIComponent(code)}`;
}

export default function PartnerHomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [copiedReferral, setCopiedReferral] = useState(false);
  const referralCode =
    (session?.user as { referralCode?: string | null } | undefined)
      ?.referralCode || '';
  const referralLink = referralCode ? buildReferralLink(referralCode) : '';

  const copyReferralLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedReferral(true);
      window.setTimeout(() => setCopiedReferral(false), 1800);
    } catch (error) {
      console.error('Failed to copy referral link:', error);
    }
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Start your business on Droooly 🚀</h1>
        <p style={styles.heroText}>
          Choose what you’d like to offer. You can always add more later.
        </p>

        <div style={styles.serviceGrid}>
          <ServiceCard
            tone="green"
            image="/dashboard/chef-service.png"
            icon={<ServicesIcon />}
            title="Add Chef Service"
            description="Offer your cooking skills as a personal chef. Set your cuisines, availability, and pricing."
            buttonText="Add Chef Service"
            tags={['Personal Chef', 'In-home Cooking']}
            onClick={() => router.push('./partner/services/chef/new')}
          />

          <ServiceCard
            tone="orange"
            image="/dashboard/meal-plan.png"
            icon={<OrdersIcon />}
            title="Create Meal Plan"
            description="Create daily or weekly meal plans and reach more customers in your area."
            buttonText="Create Meal Plan"
            tags={['Tiffin Service', 'Meal Plans']}
          />

          <ServiceCard
            tone="purple"
            image="/dashboard/catering.png"
            icon={<CalendarIcon />}
            title="Add Catering Offering"
            description="Offer your catering services for events, parties, and special occasions."
            buttonText="Add Catering Offering"
            tags={['Events', 'Bulk Orders']}
          />
        </div>
      </section>

      {referralCode && (
        <section style={styles.referralCard}>
          <div style={styles.referralContent}>
            <span style={styles.referralIcon}>
              <Share2 size={22} strokeWidth={2.4} />
            </span>

            <div style={styles.referralCopy}>
              <h2 style={styles.referralTitle}>Invite & Earn</h2>
              <p style={styles.referralText}>
                Earn commissions by referring your friends. Share your code and
                get rewarded when they join.
              </p>

              <div style={styles.referralCodeBox}>
                <span style={styles.referralCodeLabel}>Your code</span>
                <strong style={styles.referralCodeValue}>{referralCode}</strong>
              </div>

              <p style={styles.referralFinePrint}>
                Rewards are subject to eligibility, successful signup, and
                Droooly referral terms.
              </p>
            </div>
          </div>

          <div style={styles.referralActions}>
            <button
              type="button"
              style={styles.referralPrimaryButton}
              onClick={copyReferralLink}
            >
              {copiedReferral ? (
                <Check size={17} strokeWidth={2.6} />
              ) : (
                <Copy size={17} strokeWidth={2.4} />
              )}
              {copiedReferral ? 'Copied' : 'Copy Link'}
            </button>

            <Link href="/partner/referrals" style={styles.referralLinkButton}>
              Know more
            </Link>
          </div>
        </section>
      )}

      <section style={styles.statsGrid}>
        <StatCard
          icon={<CalendarIcon />}
          label="Total Bookings"
          value="24"
          note="20% vs last week"
          tone="green"
        />

        <StatCard
          icon={<OrdersIcon />}
          label="Total Orders"
          value="18"
          note="15% vs last week"
          tone="orange"
        />

        <StatCard
          icon={<EarningsIcon />}
          label="Total Earnings"
          value="₹45,600"
          note="18% vs last week"
          tone="purple"
        />

        <StatCard
          icon={<ReviewsIcon />}
          label="Reviews"
          value="4.8"
          note="★★★★★"
          tone="blue"
        />

        <StatCard
          icon={<ApprovalIcon />}
          label="Quote Requests"
          value="12"
          note="9% vs last week"
          tone="purple"
        />
      </section>

      <section style={styles.bottomGrid}>
        <DashboardCard title="Upcoming Bookings" action="View All">
          <BookingRow
            title="Wedding - 150 Guests"
            date="18 May 2024 · 7:00 PM"
            location="Jubilee Hills, Hyderabad"
            status="confirmed"
          />
          <BookingRow
            title="Weekly Meal Plan"
            date="Lunch Only · 5 Days / Week"
            location="Kondapur, Hyderabad"
            status="scheduled"
          />
        </DashboardCard>

        <DashboardCard title="Schedule" action="View Calendar">
          <ScheduleRow
            day="18"
            month="May"
            title="Wedding"
            meta="150 Guests · 7:00 PM"
            status="confirmed"
          />
          <ScheduleRow
            day="19"
            month="May"
            title="High Protein Meal Plan"
            meta="Lunch · Day 1 of Week 1"
            status="scheduled"
          />
        </DashboardCard>

        <DashboardCard title="Earnings Summary" action="View Details">
          <div style={styles.earningBox}>
            <div>
              <p style={styles.smallLabel}>This Week Earnings</p>
              <h2 style={styles.earningValue}>₹45,600</h2>
              <p style={styles.positiveText}>↑ 18% vs last week</p>
            </div>

            <div style={styles.donut}>
              <div style={styles.donutInner} />
            </div>
          </div>

          <div style={styles.legend}>
            <Legend color="#7c3aed" label="Completed" value="₹28,000" />
            <Legend color="#a855f7" label="Upcoming" value="₹12,600" />
            <Legend color="#ddd6fe" label="Pending" value="₹5,000" />
          </div>
        </DashboardCard>
      </section>
    </div>
  );
}

function ServiceCard({
  tone,
  image,
  icon,
  title,
  description,
  buttonText,
  tags,
  onClick,
}: {
  tone: 'green' | 'orange' | 'purple';
  image: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  tags: string[];
  onClick?: any;
}) {
  const theme = {
    green: {
      bg: 'linear-gradient(180deg, #f7fff7, #ffffff)',
      color: '#3f9b3f',
      button: 'linear-gradient(135deg, #4f9d35, #2f7d25)',
      chip: '#ecfdf3',
    },
    orange: {
      bg: 'linear-gradient(180deg, #fffaf0, #ffffff)',
      color: '#f59e0b',
      button: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      chip: '#fff7ed',
    },
    purple: {
      bg: 'linear-gradient(180deg, #faf5ff, #ffffff)',
      color: '#7c3aed',
      button: 'linear-gradient(135deg, #a855f7, #7c3aed)',
      chip: '#f3e8ff',
    },
  }[tone];

  return (
    <div style={{ ...styles.serviceCard, background: theme.bg }}>
      <div style={styles.imageWrap}>
        <img src={image} alt={title} style={styles.serviceImage} />
      </div>

      <div
        style={{
          ...styles.serviceIcon,
          background: theme.color,
        }}
      >
        {icon}
      </div>

      <h2 style={styles.serviceTitle}>{title}</h2>
      <p style={styles.serviceDescription}>{description}</p>

      <button
        type="button"
        style={{
          ...styles.serviceButton,
          background: theme.button,
        }}
        onClick={onClick}
      >
        {buttonText} →
      </button>

      <div style={styles.tagRow}>
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              ...styles.tag,
              background: theme.chip,
              color: theme.color,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  note,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  tone: 'green' | 'orange' | 'purple' | 'blue';
}) {
  const colors = {
    green: ['#ecfdf3', '#16a34a'],
    orange: ['#fff7ed', '#f59e0b'],
    purple: ['#f3e8ff', '#7c3aed'],
    blue: ['#eff6ff', '#2563eb'],
  };

  return (
    <div style={styles.statCard}>
      <span
        style={{
          ...styles.statIcon,
          background: colors[tone][0],
          color: colors[tone][1],
        }}
      >
        {icon}
      </span>

      <div>
        <p style={styles.statLabel}>{label}</p>
        <strong style={styles.statValue}>{value}</strong>
        <p
          style={{
            ...styles.statNote,
            color: tone === 'blue' ? '#f59e0b' : '#16a34a',
          }}
        >
          {note}
        </p>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  action,
  children,
}: {
  title: string;
  action: string;
  children: React.ReactNode;
}) {
  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>{title}</h2>
        <button style={styles.linkButton}>{action}</button>
      </div>
      <div>{children}</div>
    </section>
  );
}

function BookingRow({
  title,
  date,
  location,
  status,
}: {
  title: string;
  date: string;
  location: string;
  status: 'confirmed' | 'scheduled';
}) {
  return (
    <div style={styles.row}>
      <span style={styles.rowIcon}>
        <CalendarIcon size={17} />
      </span>

      <div style={{ flex: 1 }}>
        <strong style={styles.rowTitle}>{title}</strong>
        <p style={styles.rowText}>{date}</p>
        <p style={styles.rowText}>{location}</p>
      </div>

      <StatusBadge status={status} />
    </div>
  );
}

function ScheduleRow({
  day,
  month,
  title,
  meta,
  status,
}: {
  day: string;
  month: string;
  title: string;
  meta: string;
  status: 'confirmed' | 'scheduled';
}) {
  return (
    <div style={styles.row}>
      <div style={styles.dateBox}>
        <strong>{day}</strong>
        <span>{month}</span>
      </div>

      <div style={{ flex: 1 }}>
        <strong style={styles.rowTitle}>{title}</strong>
        <p style={styles.rowText}>{meta}</p>
      </div>

      <StatusBadge status={status} />
    </div>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div style={styles.legendRow}>
      <span style={{ ...styles.legendDot, background: color }} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },

  hero: {
    padding: '28px 24px 6px',
    borderRadius: 28,
    background:
      'radial-gradient(circle at top right, rgba(124,58,237,0.10), transparent 35%), linear-gradient(180deg, #fbf8ff, #ffffff)',
  },

  heroTitle: {
    margin: 0,
    textAlign: 'center',
    fontSize: 34,
    fontWeight: 550,
    letterSpacing: '-0.05em',
    color: '#151126',
  },

  heroText: {
    margin: '10px auto 28px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: 15,
  },

  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24,
  },

  referralCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    padding: 22,
    borderRadius: 22,
    background:
      'linear-gradient(135deg, rgba(124, 58, 237, 0.10), rgba(255, 90, 61, 0.07)), #ffffff',
    border: '1px solid rgba(124, 58, 237, 0.14)',
    boxShadow: '0 14px 34px rgba(17, 24, 39, 0.045)',
    flexWrap: 'wrap',
  },

  referralContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    minWidth: 260,
    flex: '1 1 460px',
  },

  referralIcon: {
    width: 48,
    height: 48,
    borderRadius: 999,
    background: '#ffffff',
    color: '#7c3aed',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 22px rgba(124, 58, 237, 0.14)',
    flexShrink: 0,
  },

  referralCopy: {
    minWidth: 0,
  },

  referralTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 650,
    color: '#151126',
  },

  referralText: {
    margin: '6px 0 14px',
    maxWidth: 640,
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 1.5,
  },

  referralCodeBox: {
    width: 'fit-content',
    maxWidth: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 12px',
    borderRadius: 12,
    background: '#ffffff',
    border: '1px solid #ddd6fe',
  },

  referralCodeLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: 650,
  },

  referralCodeValue: {
    color: '#5b21b6',
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: 0,
  },

  referralFinePrint: {
    margin: '10px 0 0',
    color: '#64748b',
    fontSize: 12,
    lineHeight: 1.45,
  },

  referralActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },

  referralPrimaryButton: {
    minHeight: 42,
    border: 'none',
    borderRadius: 13,
    padding: '0 15px',
    background: '#5b21b6',
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 800,
    boxShadow: '0 12px 24px rgba(91, 33, 182, 0.18)',
  },

  referralLinkButton: {
    minHeight: 42,
    borderRadius: 13,
    padding: '0 14px',
    background: '#ffffff',
    color: '#5b21b6',
    border: '1px solid #ddd6fe',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 800,
  },

  serviceCard: {
    position: 'relative',
    padding: 22,
    borderRadius: 24,
    border: '1px solid #eee9f7',
    boxShadow: '0 16px 40px rgba(17, 24, 39, 0.05)',
    textAlign: 'center',
  },

  imageWrap: {
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 28,
  },

  serviceImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  serviceIcon: {
    position: 'absolute',
    top: 174,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 58,
    height: 58,
    borderRadius: 999,
    color: '#ffffff',
    border: '4px solid #ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 24px rgba(17,24,39,0.12)',
  },

  serviceTitle: {
    margin: '4px 10px',
    fontSize: 18,
    fontWeight: 350,
    color: '#151126',
  },

  serviceDescription: {
    margin: '0 auto 20px',
    maxWidth: 300,
    fontSize: 14,
    lineHeight: 1.55,
    color: '#4b5563',
  },

  serviceButton: {
    width: '100%',
    border: 'none',
    borderRadius: 13,
    padding: '13px 14px',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },

  tagRow: {
    marginTop: 18,
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },

  tag: {
    padding: '8px 14px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 550,
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: 18,
  },

  statCard: {
    padding: 18,
    borderRadius: 20,
    background: '#ffffff',
    border: '1px solid #eee9f7',
    boxShadow: '0 12px 34px rgba(17, 24, 39, 0.035)',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },

  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 999,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statLabel: {
    margin: 0,
    fontSize: 13,
    color: '#64748b',
  },

  statValue: {
    display: 'block',
    marginTop: 2,
    fontSize: 24,
    fontWeight: 550,
    color: '#151126',
  },

  statNote: {
    margin: '4px 0 0',
    fontSize: 12,
    fontWeight: 550,
  },

  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 20,
  },

  card: {
    background: '#ffffff',
    border: '1px solid #eee9f7',
    borderRadius: 22,
    boxShadow: '0 12px 34px rgba(17, 24, 39, 0.035)',
    overflow: 'hidden',
  },

  cardHeader: {
    padding: '18px 20px',
    borderBottom: '1px solid #f5f1fb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: '#151126',
  },

  linkButton: {
    border: 'none',
    background: 'transparent',
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },

  row: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    borderBottom: '1px solid #f6f2fb',
  },

  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    background: '#f3e8ff',
    color: '#7c3aed',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rowTitle: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#151126',
  },

  rowText: {
    margin: '4px 0 0',
    fontSize: 12,
    color: '#64748b',
  },

  dateBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    border: '1px solid #eee9f7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#151126',
  },

  earningBox: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },

  smallLabel: {
    margin: 0,
    fontSize: 13,
    color: '#64748b',
  },

  earningValue: {
    margin: '6px 0',
    fontSize: 28,
    fontWeight: 550,
    color: '#151126',
  },

  positiveText: {
    margin: 0,
    fontSize: 13,
    color: '#16a34a',
    fontWeight: 500,
  },

  donut: {
    width: 96,
    height: 96,
    borderRadius: 999,
    background:
      'conic-gradient(#7c3aed 0 58%, #a855f7 58% 82%, #ddd6fe 82% 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  donutInner: {
    width: 52,
    height: 52,
    borderRadius: 999,
    background: '#ffffff',
  },

  legend: {
    padding: '0 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 9,
  },

  legendRow: {
    display: 'grid',
    gridTemplateColumns: '16px 1fr auto',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#64748b',
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
};
