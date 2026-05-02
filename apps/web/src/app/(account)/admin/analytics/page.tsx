import AccountSectionPage from '../../components/AccountSectionPage';

export default function AdminAnalyticsPage() {
  return (
    <AccountSectionPage
      title="Analytics"
      description="Review marketplace performance, partner activity, and platform health."
      stats={[
        { label: 'Revenue', value: '0' },
        { label: 'Orders', value: '0' },
        { label: 'Conversion', value: '0%' },
      ]}
    />
  );
}
