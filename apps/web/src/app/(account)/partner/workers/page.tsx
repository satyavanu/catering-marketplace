import AccountSectionPage from '../../components/AccountSectionPage';

export default function PartnerWorkersPage() {
  return (
    <AccountSectionPage
      title="Event Workers"
      description="Coordinate worker assignments and availability for partner events."
      stats={[
        { label: 'Available', value: '0' },
        { label: 'Assigned', value: '0' },
        { label: 'Needs review', value: '0' },
      ]}
    />
  );
}
