import AccountSectionPage from '../../components/AccountSectionPage';

export default function PartnerEarningsPage() {
  return (
    <AccountSectionPage
      title="Earnings"
      description="Track partner payouts, invoices, and payment performance."
      stats={[
        { label: 'This month', value: '0' },
        { label: 'Pending payout', value: '0' },
        { label: 'Completed payouts', value: '0' },
      ]}
    />
  );
}
