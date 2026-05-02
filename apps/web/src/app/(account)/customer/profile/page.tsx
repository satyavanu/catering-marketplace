import AccountSectionPage from '../../components/AccountSectionPage';

export default function CustomerProfilePage() {
  return (
    <AccountSectionPage
      title="Customer Profile"
      description="Manage your contact details, preferences, and saved account information."
      actions={[
        'Confirm your contact information',
        'Set communication preferences',
        'Review privacy and consent settings',
      ]}
    />
  );
}
