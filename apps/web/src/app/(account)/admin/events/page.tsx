import AccountSectionPage from '../../components/AccountSectionPage';

export default function AdminEventsPage() {
  return (
    <AccountSectionPage
      title="Events"
      description="Track customer events, fulfillment state, and operational exceptions."
      stats={[
        { label: 'Open events', value: '0' },
        { label: 'Needs attention', value: '0' },
        { label: 'Completed', value: '0' },
      ]}
    />
  );
}
