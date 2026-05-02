import AccountSectionPage from '../components/AccountSectionPage';

export default function CustomerHomePage() {
  return (
    <AccountSectionPage
      title="Customer Home"
      description="Track your catering requests, bookings, orders, and messages from one account area."
      stats={[
        { label: 'Active bookings', value: '0' },
        { label: 'Open orders', value: '0' },
        { label: 'Unread messages', value: '0' },
      ]}
      actions={[
        'Review upcoming bookings',
        'Check order status',
        'Complete your customer profile',
      ]}
    />
  );
}
