import AccountSectionPage from '../../components/AccountSectionPage';

export default function CustomerBookingsPage() {
  return (
    <AccountSectionPage
      title="Customer Bookings"
      description="View and manage upcoming catering bookings."
      stats={[
        { label: 'Upcoming', value: '0' },
        { label: 'Pending quotes', value: '0' },
        { label: 'Completed', value: '0' },
      ]}
    />
  );
}
