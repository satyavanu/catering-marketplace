import AccountSectionPage from '../../components/AccountSectionPage';

export default function CustomerReviewsPage() {
  return (
    <AccountSectionPage
      title="Customer Reviews"
      description="Review past catering experiences and manage submitted feedback."
      stats={[
        { label: 'Pending reviews', value: '0' },
        { label: 'Submitted', value: '0' },
      ]}
    />
  );
}
