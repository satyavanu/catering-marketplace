import AccountSectionPage from '../components/AccountSectionPage';

export default function AdminHomePage() {
  return (
    <AccountSectionPage
      title="Admin Home"
      description="Monitor platform activity, approvals, events, and operational queues."
      stats={[
        { label: 'Pending approvals', value: '0' },
        { label: 'Active partners', value: '0' },
        { label: 'Open events', value: '0' },
      ]}
      actions={[
        'Review pending partner approvals',
        'Check event worker queues',
        'Monitor recent platform activity',
      ]}
    />
  );
}
