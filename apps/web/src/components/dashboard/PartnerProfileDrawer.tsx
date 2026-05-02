import React from 'react';

type MetaOption = {
  id: string;
  label: string;
};

type PartnerDetail = {
  id: string;

  basicProfile?: {
    contactName?: string;
    businessName?: string;
    businessDescription?: string;
    kitchenAddress?: string;
    partnerType?: string;
  };

  businessProfile?: {
    businessTypes?: MetaOption[];
  };

  serviceProfile?: {
    cuisineTypes?: MetaOption[];
    serviceTypes?: MetaOption[];
    eventTypes?: MetaOption[];
    dietaryTypes?: MetaOption[];
  };

  serviceAreas?: any[];

  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };

  status?: string;
};

type Props = {
  partnerId: string;
  onClose: () => void;
  useAdminPartner: (id: string) => {
    data: PartnerDetail | undefined;
    isLoading: boolean;
    error: any;
  };
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <div style={{ marginBottom: 10 }}>
    <strong>{label}:</strong> {value || '-'}
  </div>
);

const mapLabels = (items?: MetaOption[]) =>
  items?.map((i) => i.label).join(', ') || '-';

export default function PartnerProfileDrawer({
  partnerId,
  onClose,
  useAdminPartner,
}: Props) {
  const { data, isLoading, error } = useAdminPartner(partnerId);

  if (!partnerId) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.drawer}>
        <div style={styles.header}>
          <h2>Partner Details</h2>
          <button onClick={onClose}>Close</button>
        </div>

        {isLoading && <p>Loading...</p>}

        {error && (
          <p style={{ color: 'red' }}>
            Failed to load partner details
          </p>
        )}

        {!isLoading && data && (
          <>
            <h3>Basic Info</h3>
            <InfoRow label="Contact Name" value={data.basicProfile?.contactName} />
            <InfoRow label="Business Name" value={data.basicProfile?.businessName} />
            <InfoRow label="Description" value={data.basicProfile?.businessDescription} />
            <InfoRow label="Kitchen Address" value={data.basicProfile?.kitchenAddress} />
            <InfoRow label="Partner Type" value={data.basicProfile?.partnerType} />

            <h3>Business</h3>
            <InfoRow
              label="Business Types"
              value={mapLabels(data.businessProfile?.businessTypes)}
            />

            <h3>Services</h3>
            <InfoRow
              label="Cuisines"
              value={mapLabels(data.serviceProfile?.cuisineTypes)}
            />
            <InfoRow
              label="Service Types"
              value={mapLabels(data.serviceProfile?.serviceTypes)}
            />
            <InfoRow
              label="Event Types"
              value={mapLabels(data.serviceProfile?.eventTypes)}
            />
            <InfoRow
              label="Dietary Types"
              value={mapLabels(data.serviceProfile?.dietaryTypes)}
            />

            <h3>User</h3>
            <InfoRow label="Name" value={data.user?.name} />
            <InfoRow label="Email" value={data.user?.email} />
            <InfoRow label="Phone" value={data.user?.phone} />

            <h3>Status</h3>
            <InfoRow label="Status" value={data.status} />
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  drawer: {
    width: 400,
    background: '#fff',
    padding: 20,
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
};