import AccountSectionPage from '../../components/AccountSectionPage';

export default function AdminSettingsPage() {
  return (
    <AccountSectionPage
      title="Settings"
      description="Configure admin preferences, platform controls, and operational defaults."
      actions={[
        'Review role and permission rules',
        'Configure notification channels',
        'Check platform defaults',
      ]}
    />
  );
}
