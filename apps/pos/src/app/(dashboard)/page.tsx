'use client';

export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
        Welcome to CaterPOS Dashboard
      </h1>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', margin: '0 0 0.5rem 0' }}>
                Total Orders
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                1,234
              </p>
            </div>
            <span style={{ fontSize: '2rem' }}>📋</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', margin: '0 0 0.5rem 0' }}>
                Today Revenue
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                $2,450
              </p>
            </div>
            <span style={{ fontSize: '2rem' }}>💰</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', margin: '0 0 0.5rem 0' }}>
                Pending Orders
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>
                12
              </p>
            </div>
            <span style={{ fontSize: '2rem' }}>⏳</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', margin: '0 0 0.5rem 0' }}>
                Total Customers
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>
                456
              </p>
            </div>
            <span style={{ fontSize: '2rem' }}>👥</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
          Recent Orders
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                Order ID
              </th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                Customer
              </th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                Amount
              </th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: '#6b7280', fontWeight: '600', fontSize: '0.875rem' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '0.75rem', color: '#1f2937', fontSize: '0.875rem' }}>
                  #ORD-00{i}
                </td>
                <td style={{ padding: '0.75rem', color: '#1f2937', fontSize: '0.875rem' }}>
                  Customer {i}
                </td>
                <td style={{ padding: '0.75rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>
                  ${(100 * i).toFixed(2)}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: i % 2 === 0 ? '#dbeafe' : '#fef3c7',
                      color: i % 2 === 0 ? '#1e40af' : '#92400e',
                    }}
                  >
                    {i % 2 === 0 ? 'Completed' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}