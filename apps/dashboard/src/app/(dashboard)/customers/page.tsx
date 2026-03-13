'use client';

import React, { useState } from 'react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  joinDate: string;
  status: 'active' | 'inactive';
  tier: 'gold' | 'silver' | 'bronze' | 'regular';
  address: string;
  city: string;
  preferredMenu?: string;
}

interface Order {
  id: number;
  customerId: number;
  eventName: string;
  date: string;
  guests: number;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  menu: string;
}

interface Review {
  id: number;
  customerId: number;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  eventName: string;
}

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'repeat' | 'reviews'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1-234-567-8901',
      orders: 5,
      totalSpent: 2250,
      lastOrder: '2026-03-10',
      joinDate: '2023-05-15',
      status: 'active',
      tier: 'gold',
      address: '123 Main St',
      city: 'New York',
      preferredMenu: 'Italian Cuisine',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+1-234-567-8902',
      orders: 8,
      totalSpent: 3850,
      lastOrder: '2026-03-08',
      joinDate: '2022-11-20',
      status: 'active',
      tier: 'gold',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      preferredMenu: 'French Cuisine',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1-234-567-8903',
      orders: 3,
      totalSpent: 1350,
      lastOrder: '2026-02-15',
      joinDate: '2024-01-10',
      status: 'active',
      tier: 'silver',
      address: '789 Pine Rd',
      city: 'Chicago',
      preferredMenu: 'Asian Fusion',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      phone: '+1-234-567-8904',
      orders: 12,
      totalSpent: 5680,
      lastOrder: '2026-03-05',
      joinDate: '2022-03-08',
      status: 'active',
      tier: 'gold',
      address: '321 Elm St',
      city: 'Boston',
      preferredMenu: 'Mediterranean',
    },
    {
      id: 5,
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      phone: '+1-234-567-8905',
      orders: 2,
      totalSpent: 890,
      lastOrder: '2026-01-20',
      joinDate: '2025-09-01',
      status: 'inactive',
      tier: 'bronze',
      address: '654 Maple Dr',
      city: 'Seattle',
    },
    {
      id: 6,
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '+1-234-567-8906',
      orders: 15,
      totalSpent: 7420,
      lastOrder: '2026-03-12',
      joinDate: '2021-06-12',
      status: 'active',
      tier: 'gold',
      address: '987 Birch Ln',
      city: 'Miami',
      preferredMenu: 'Vegetarian',
    },
    {
      id: 7,
      name: 'Frank Miller',
      email: 'frank@example.com',
      phone: '+1-234-567-8907',
      orders: 1,
      totalSpent: 450,
      lastOrder: '2026-02-28',
      joinDate: '2025-12-15',
      status: 'active',
      tier: 'bronze',
      address: '159 Cedar Ct',
      city: 'Denver',
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      customerId: 1,
      eventName: 'Birthday Party',
      date: '2026-03-10',
      guests: 30,
      amount: 450,
      status: 'completed',
      menu: 'Birthday Package',
    },
    {
      id: 2,
      customerId: 1,
      eventName: 'Corporate Event',
      date: '2026-02-20',
      guests: 75,
      amount: 1200,
      status: 'completed',
      menu: 'Corporate Lunch',
    },
    {
      id: 3,
      customerId: 2,
      eventName: 'Wedding Reception',
      date: '2026-03-08',
      guests: 120,
      amount: 2850,
      status: 'completed',
      menu: 'Wedding Package',
    },
    {
      id: 4,
      customerId: 2,
      eventName: 'Anniversary Dinner',
      date: '2026-01-15',
      guests: 50,
      amount: 1000,
      status: 'completed',
      menu: 'Premium Buffet',
    },
    {
      id: 5,
      customerId: 4,
      eventName: 'Gala Event',
      date: '2026-03-05',
      guests: 200,
      amount: 3200,
      status: 'completed',
      menu: 'Premium Package',
    },
  ]);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      customerId: 1,
      customerName: 'John Smith',
      rating: 5,
      comment: 'Excellent service and delicious food. Highly recommended!',
      date: '2026-03-10',
      eventName: 'Birthday Party',
    },
    {
      id: 2,
      customerId: 2,
      customerName: 'Jane Doe',
      rating: 5,
      comment: 'Our wedding was perfect! Great attention to detail.',
      date: '2026-03-08',
      eventName: 'Wedding Reception',
    },
    {
      id: 3,
      customerId: 4,
      customerName: 'Alice Brown',
      rating: 4,
      comment: 'Very good food and professional staff. Minor timing issue.',
      date: '2026-03-05',
      eventName: 'Gala Event',
    },
    {
      id: 4,
      customerId: 1,
      customerName: 'John Smith',
      rating: 5,
      comment: 'Always delivers on quality. Best caterer in town!',
      date: '2026-02-20',
      eventName: 'Corporate Event',
    },
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  // Filter and sort customers
  const filteredCustomers = customers
    .filter((customer) => {
      if (activeTab === 'repeat') {
        return customer.orders > 1;
      }
      return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'orders') {
        return b.orders - a.orders;
      } else if (sortBy === 'spent') {
        return b.totalSpent - a.totalSpent;
      } else {
        return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
      }
    });

  const repeatCustomersCount = customers.filter((c) => c.orders > 1).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.orders, 0);
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      const customer: Customer = {
        id: Math.max(...customers.map((c) => c.id), 0) + 1,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address,
        city: newCustomer.city,
        orders: 0,
        totalSpent: 0,
        lastOrder: new Date().toISOString().split('T')[0],
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
        tier: 'bronze',
      };
      setCustomers([...customers, customer]);
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
      });
      setShowAddCustomer(false);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetail(true);
  };

  const handleDeleteCustomer = (id: number) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  const customerOrders = selectedCustomer
    ? orders.filter((o) => o.customerId === selectedCustomer.id)
    : [];

  const customerReviews = selectedCustomer
    ? reviews.filter((r) => r.customerId === selectedCustomer.id)
    : [];

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f0f0f0',
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold':
        return '#fbbf24';
      case 'silver':
        return '#d1d5db';
      case 'bronze':
        return '#d97706';
      default:
        return '#6b7280';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'gold':
        return '👑 Gold';
      case 'silver':
        return '⭐ Silver';
      case 'bronze':
        return '🥉 Bronze';
      default:
        return 'Regular';
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
              👥 Customer Management
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
              Manage customer relationships, orders, and reviews
            </p>
          </div>
          <button
            onClick={() => setShowAddCustomer(true)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
          >
            + Add Customer
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ ...cardStyle, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                  Total Customers
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.875rem', fontWeight: 'bold', color: '#667eea' }}>
                  {customers.length}
                </p>
              </div>
              <span style={{ fontSize: '2rem' }}>👥</span>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                  Repeat Customers
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.875rem', fontWeight: 'bold', color: '#10b981' }}>
                  {repeatCustomersCount}
                </p>
              </div>
              <span style={{ fontSize: '2rem' }}>🔄</span>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                  Total Revenue
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.875rem', fontWeight: 'bold', color: '#f59e0b' }}>
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <span style={{ fontSize: '2rem' }}>💰</span>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                  Avg. Rating
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.875rem', fontWeight: 'bold', color: '#ec4899' }}>
                  {avgRating}⭐
                </p>
              </div>
              <span style={{ fontSize: '2rem' }}>⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem' }}>
        {(['all', 'repeat', 'reviews'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === tab ? '3px solid #667eea' : 'none',
              color: activeTab === tab ? '#667eea' : '#6b7280',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? '600' : '500',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab) {
                e.currentTarget.style.color = '#1f2937';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab) {
                e.currentTarget.style.color = '#6b7280';
              }
            }}
          >
            {tab === 'repeat' ? `🔄 Repeat Customers (${repeatCustomersCount})` : tab === 'reviews' ? `⭐ Reviews (${reviews.length})` : `All Customers (${customers.length})`}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#1f2937',
            boxSizing: 'border-box',
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#1f2937',
            backgroundColor: 'white',
            boxSizing: 'border-box',
          }}
        >
          <option value="recent">Sort by Recent</option>
          <option value="orders">Sort by Orders</option>
          <option value="spent">Sort by Total Spent</option>
        </select>
      </div>

      {/* Customers Table */}
      {activeTab !== 'reviews' && (
        <div style={cardStyle}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                    Name
                  </th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                    Email
                  </th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                    Phone
                  </th>
                  <th style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                    Tier
                  </th>
                  <th style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                    Orders
                  </th>
                  <th style={{ textAlign: 'right', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                    Total Spent
                  </th>
                  <th style={{ textAlign: 'left', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                    Last Order
                  </th>
                  <th style={{ textAlign: 'center', padding: '1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    style={{ borderBottom: '1px solid #f3f4f6' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>
                      {customer.name}
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      {customer.email}
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      {customer.phone}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '0.375rem',
                          backgroundColor: `${getTierColor(customer.tier)}20`,
                          color: getTierColor(customer.tier),
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                      >
                        {getTierLabel(customer.tier)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>
                      {customer.orders}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: '#1f2937', fontSize: '0.875rem', fontWeight: '600' }}>
                      ${customer.totalSpent.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      {new Date(customer.lastOrder).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleViewCustomer(customer)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          backgroundColor: '#dbeafe',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#0c4a6e',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bfdbfe')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          backgroundColor: '#fee2e2',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#991b1b',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fecaca')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {reviews.map((review) => (
            <div key={review.id} style={{ ...cardStyle, padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '0.95rem' }}>
                    {review.customerName}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                    {review.eventName}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '1rem',
                        opacity: i < review.rating ? 1 : 0.3,
                      }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <p style={{ margin: '1rem 0', color: '#1f2937', fontSize: '0.875rem', lineHeight: '1.5' }}>
                "{review.comment}"
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Customer Detail Modal */}
      {showCustomerDetail && selectedCustomer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            overflowY: 'auto',
            padding: '2rem 1rem',
          }}
          onClick={() => setShowCustomerDetail(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '2rem',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '0.5rem' }}>
                  {selectedCustomer.name}
                </h2>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.375rem',
                    backgroundColor: `${getTierColor(selectedCustomer.tier)}20`,
                    color: getTierColor(selectedCustomer.tier),
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  {getTierLabel(selectedCustomer.tier)}
                </span>
              </div>
              <button
                onClick={() => setShowCustomerDetail(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                }}
              >
                ✕
              </button>
            </div>

            {/* Customer Info */}
            <div style={{ padding: '2rem', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '1rem' }}>
                Personal Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Email</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#1f2937', fontWeight: '500' }}>
                    {selectedCustomer.email}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Phone</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#1f2937', fontWeight: '500' }}>
                    {selectedCustomer.phone}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Address</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#1f2937', fontWeight: '500' }}>
                    {selectedCustomer.address}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>City</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#1f2937', fontWeight: '500' }}>
                    {selectedCustomer.city}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Member Since</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#1f2937', fontWeight: '500' }}>
                    {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Status</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#1f2937', fontWeight: '500', textTransform: 'capitalize' }}>
                    {selectedCustomer.status}
                  </p>
                </div>
              </div>
              {selectedCustomer.preferredMenu && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Preferred Menu</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#1f2937', fontWeight: '500' }}>
                    {selectedCustomer.preferredMenu}
                  </p>
                </div>
              )}
            </div>

            {/* Customer Stats */}
            <div style={{ padding: '2rem', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '1rem' }}>
                Order Statistics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#0369a1', fontWeight: '500' }}>Total Orders</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#0284c7' }}>
                    {selectedCustomer.orders}
                  </p>
                </div>
                <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#166534', fontWeight: '500' }}>Total Spent</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                    ${selectedCustomer.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#92400e', fontWeight: '500' }}>Avg. Order</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                    ${selectedCustomer.orders > 0 ? Math.round(selectedCustomer.totalSpent / selectedCustomer.orders) : 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Event History */}
            <div style={{ padding: '2rem', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '1rem' }}>
                Event History
              </h3>
              {customerOrders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {customerOrders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem',
                        borderLeft: '4px solid #667eea',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                            {order.eventName}
                          </p>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                            {order.menu}
                          </p>
                        </div>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            backgroundColor: order.status === 'completed' ? '#d1fae5' : '#fef3c7',
                            color: order.status === 'completed' ? '#065f46' : '#92400e',
                            textTransform: 'capitalize',
                          }}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                        <span>📅 {new Date(order.date).toLocaleDateString()}</span>
                        <span>👥 {order.guests} guests</span>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>${order.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>No orders yet</p>
              )}
            </div>

            {/* Customer Reviews */}
            {customerReviews.length > 0 && (
              <div style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '1rem' }}>
                  Reviews
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {customerReviews.map((review) => (
                    <div key={review.id} style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <p style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                          {review.eventName}
                        </p>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '0.875rem',
                                opacity: i < review.rating ? 1 : 0.3,
                              }}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#1f2937', lineHeight: '1.5' }}>
                        "{review.comment}"
                      </p>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setShowAddCustomer(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0, marginBottom: '1.5rem' }}>
              Add New Customer
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Customer name"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="+1-234-567-8900"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  Address
                </label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Street address"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                  City
                </label>
                <input
                  type="text"
                  value={newCustomer.city}
                  onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                  placeholder="City"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleAddCustomer}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#667eea',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
              >
                Add Customer
              </button>
              <button
                onClick={() => setShowAddCustomer(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#1f2937',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}