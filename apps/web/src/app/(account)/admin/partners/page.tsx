import AccountSectionPage from '../../components/AccountSectionPage';

export default function AdminPartnersPage() {
  return (
    <AccountSectionPage
      title="Partners"
      description="Manage partner accounts, onboarding status, and operational health."
      stats={[
        { label: 'Active partners', value: '0' },
        { label: 'Pending review', value: '0' },
        { label: 'Suspended', value: '0' },
      ]}
    />
  );
}
