import AccountSectionPage from '../../components/AccountSectionPage';

export default function PartnerBookingsPage() {
  return (
    <AccountSectionPage
      title="Partner Bookings"
      description="Review upcoming booking requests, schedules, and event commitments."
      stats={[
        { label: 'Upcoming', value: '0' },
        { label: 'Pending', value: '0' },
        { label: 'Confirmed', value: '0' },
      ]}
    />
  );
}
