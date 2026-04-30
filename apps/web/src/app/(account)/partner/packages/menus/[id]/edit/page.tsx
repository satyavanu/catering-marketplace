'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

export default function EditMenuPage() {
  const router = useRouter();
  const params = useParams();
  const menuId = params.id;

  const [formData, setFormData] = useState({
    name: 'Regular Menu',
    description: 'Standard menu',
    isActive: true,
  });

  const handleSave = () => {
    alert('Menu updated!');
    router.push('/caterer/packages');
  };

  return (
    <div style={styles.container}>
      <button onClick={() => router.back()} style={styles.backButton}>
        ← Back
      </button>
      <h1 style={styles.title}>✏️ Edit Menu</h1>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Menu Details</h2>
        <div style={styles.formGroup}>
          <label style={styles.label}>Menu Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.actions}>
        <button onClick={() => router.back()} style={styles.buttonSecondary}>
          Cancel
        </button>
        <button onClick={handleSave} style={styles.buttonPrimary}>
          Update Menu
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  backButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  title: { fontSize: '28px', fontWeight: '700', marginBottom: '24px' },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
    marginBottom: '24px',
  },
  cardTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '16px', margin: 0 },
  formGroup: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600' },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
  },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  buttonPrimary: {
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
  },
  buttonSecondary: {
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    fontWeight: '600',
  },
};