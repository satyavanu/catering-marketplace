import AccountSectionPage from '../../components/AccountSectionPage';

export default function CustomerMessagesPage() {
  return (
    <AccountSectionPage
      title="Customer Messages"
      description="Continue conversations with caterers and support."
      stats={[
        { label: 'Unread', value: '0' },
        { label: 'Open threads', value: '0' },
      ]}
    />
  );
}
