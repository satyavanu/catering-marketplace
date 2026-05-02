import AccountSectionPage from '../../components/AccountSectionPage';

export default function AdminWorkersPage() {
  return (
    <AccountSectionPage
      title="Event Workers"
      description="Manage worker queues, assignments, and worker availability."
      stats={[
        { label: 'Available', value: '0' },
        { label: 'Assigned', value: '0' },
        { label: 'Blocked', value: '0' },
      ]}
    />
  );
}
