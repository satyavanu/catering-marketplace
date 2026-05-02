import AccountSectionPage from '../../components/AccountSectionPage';

export default function AdminMessagesPage() {
  return (
    <AccountSectionPage
      title="Admin Messages"
      description="Review operational messages, support escalations, and platform notifications."
      stats={[
        { label: 'Unread', value: '0' },
        { label: 'Escalations', value: '0' },
      ]}
    />
  );
}
