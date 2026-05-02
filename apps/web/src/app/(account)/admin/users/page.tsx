import AccountSectionPage from '../../components/AccountSectionPage';

export default function AdminUsersPage() {
  return (
    <AccountSectionPage
      title="Users"
      description="Search, review, and manage customer and partner user records."
      stats={[
        { label: 'Total users', value: '0' },
        { label: 'Suspended', value: '0' },
        { label: 'New this week', value: '0' },
      ]}
    />
  );
}
