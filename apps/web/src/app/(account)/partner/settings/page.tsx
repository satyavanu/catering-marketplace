import AccountSectionPage from '../../components/AccountSectionPage';

export default function PartnerSettingsPage() {
  return (
    <AccountSectionPage
      title="Partner Settings"
      description="Manage partner account preferences, communication settings, and platform defaults."
      actions={[
        'Update notification preferences',
        'Review account access',
        'Confirm business settings',
      ]}
    />
  );
}
