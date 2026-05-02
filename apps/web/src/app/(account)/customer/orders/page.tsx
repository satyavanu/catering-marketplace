import AccountSectionPage from '../../components/AccountSectionPage';

export default function CustomerOrdersPage() {
  return (
    <AccountSectionPage
      title="Customer Orders"
      description="Follow order progress, invoices, and delivery details."
      stats={[
        { label: 'Open orders', value: '0' },
        { label: 'Awaiting payment', value: '0' },
        { label: 'Completed', value: '0' },
      ]}
    />
  );
}
