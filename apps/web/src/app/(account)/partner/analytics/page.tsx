import AccountSectionPage from '../../components/AccountSectionPage';

export default function PartnerAnalyticsPage() {
  return (
    <AccountSectionPage
      title="Partner Analytics"
      description="Measure booking trends, quote conversion, reviews, and service performance."
      stats={[
        { label: 'Views', value: '0' },
        { label: 'Conversion', value: '0%' },
        { label: 'Avg rating', value: '0.0' },
      ]}
    />
  );
}
