import AccountSectionPage from '../../components/AccountSectionPage';

export default function AdminProfilePage() {
  return (
    <AccountSectionPage
      title="Admin Profile"
      description="Manage your admin account details and communication preferences."
      actions={[
        'Review account information',
        'Confirm security preferences',
        'Check notification settings',
      ]}
    />
  );
}
