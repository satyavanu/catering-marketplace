'use client';

import React, { useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface Booking {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  catererId: string;
  catererName: string;
  items: string[];
  totalAmount: number;
  eventDate: string;
  eventLocation: string;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  guestCount: number;
  specialRequests?: string;
}

export default function BookingsAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'eventDate' | 'amount'>('recent');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [bookings] = useState<Booking[]>([
    {
      id: 'b1',
      orderId: 'ORD001',
      customerId: 'u1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      catererId: '1',
      catererName: 'Tasty Kitchen',
      items: ['Butter Chicken', 'Dal Makhani', 'Naan', 'Rice'],
      totalAmount: 5000,
      eventDate: '2024-04-15',
      eventLocation: 'Central Park, New Delhi',
      bookingDate: '2024-03-15',
      status: 'confirmed',
      guestCount: 50,
      specialRequests: 'No onion, no garlic',
    },
    {
      id: 'b2',
      orderId: 'ORD002',
      customerId: 'u2',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      catererId: '2',
      catererName: 'Spice Delight',
      items: ['Paneer Tikka', 'Biryani', 'Raita'],
      totalAmount: 7500,
      eventDate: '2024-04-20',
      eventLocation: 'Grand Hotel, Mumbai',
      bookingDate: '2024-03-16',
      status: 'pending',
      guestCount: 75,
    },
    {
      id: 'b3',
      orderId: 'ORD003',
      customerId: 'u3',
      customerName: 'Mike Wilson',
      customerEmail: 'mike@example.com',
      catererId: '1',
      catererName: 'Tasty Kitchen',
      items: ['Chicken Tikka Masala', 'Rice', 'Salad'],
      totalAmount: 3500,
      eventDate: '2024-03-25',
      eventLocation: 'Community Center, Bangalore',
      bookingDate: '2024-03-10',
      status: 'completed',
      guestCount: 30,
    },
    {
      id: 'b4',
      orderId: 'ORD004',
      customerId: 'u5',
      customerName: 'Anil Kumar',
      customerEmail: 'anil@example.com',
      catererId: '2',
      catererName: 'Spice Delight',
      items: ['Tandoori Chicken', 'Naan', 'Soup'],
      totalAmount: 4200,
      eventDate: '2024-03-30',
      eventLocation: 'Wedding Hall, Pune',
      bookingDate: '2024-03-08',
      status: 'cancelled',
      guestCount: 100,
      specialRequests: 'Jain food required',
    },
  ]);

  const filteredBookings = useMemo(() => {
    let filtered = bookings.filter((b) => {
      const matchesSearch =
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.catererName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.eventLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'all' || b.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
    } else if (sortBy === 'eventDate') {
      filtered.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    } else if (sortBy === 'amount') {
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    return filtered;
  }, [bookings, searchQuery, filterStatus, sortBy]);

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, any> = {
      confirmed: {
        bg: '#dcfce7',
        color: '#166534',
        icon: CheckCircleIcon,
        label: 'Confirmed',
      },
      pending: {
        bg: '#fef3c7',
        color: '#92400e',
        icon: ClockIcon,
        label: 'Pending',
      },
      cancelled: {
        bg: '#fee2e2',
        color: '#991b1b',
        icon: XCircleIcon,
        label: 'Cancelled',
      },
      completed: {
        bg: '#dbeafe',
        color: '#0c4a6e',
        icon: CheckCircleIcon,
        label: 'Completed',
      },
    };

    const status_info = statuses[status] || statuses.pending;
    const Icon = status_info.icon;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          backgroundColor: status_info.bg,
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
          color: status_info.color,
        }}
      >
        <Icon style={{ width: '14px', height: '14px' }} />
        {status_info.label}
      </div>
    );
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
          📅 Bookings Management
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Monitor and manage all event bookings
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div
          style={{
            flex: 1,
            minWidth: '250px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderRadius: '8px',
            paddingLeft: '12px',
            paddingRight: '12px',
            backgroundColor: 'white',
            border: '2px solid #e2e8f0',
            height: '40px',
          }}
        >
          <MagnifyingGlassIcon style={{ width: '18px', height: '18px', color: '#94a3b8', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by customer, caterer, order ID, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '13px',
              color: '#1e293b',
              minWidth: '0',
            }}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '2px solid #e2e8f0',
            backgroundColor: 'white',
            color: '#1e293b',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Status</option>
          <option value="confirmed">✓ Confirmed</option>
          <option value="pending">⏳ Pending</option>
          <option value="completed">✅ Completed</option>
          <option value="cancelled">✗ Cancelled</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '2px solid #e2e8f0',
            backgroundColor: 'white',
            color: '#1e293b',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          <option value="recent">Recently Booked</option>
          <option value="eventDate">Event Date</option>
          <option value="amount">Amount</option>
        </select>
      </div>

      {/* BOOKINGS TABLE */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Order ID
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Customer
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Caterer
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Event Date
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Guests
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Amount
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    {booking.orderId}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
                    <div>{booking.customerName}</div>
                    <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>{booking.customerEmail}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
                    {booking.catererName}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
                    {new Date(booking.eventDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    {booking.guestCount}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    ₹{booking.totalAmount.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {getStatusBadge(booking.status)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetailModal(true);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px 12px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        gap: '4px',
                      }}
                    >
                      <EyeIcon style={{ width: '14px', height: '14px' }} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOOKING DETAIL MODAL */}
      {showDetailModal && selectedBooking && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setShowDetailModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    Booking Details: {selectedBooking.orderId}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Booked on {new Date(selectedBooking.bookingDate).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    fontSize: '24px',
                    color: '#94a3b8',
                  }}
                >
                  ✕
                </button>
              </div>
              {getStatusBadge(selectedBooking.status)}
            </div>

            {/* Details */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Customer Info */}
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                    Customer
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '8px 0 0 0' }}>
                    {selectedBooking.customerName}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                    {selectedBooking.customerEmail}
                  </p>
                </div>

                {/* Caterer Info */}
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: 0 }}>
                    Caterer
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '8px 0 0 0' }}>
                    {selectedBooking.catererName}
                  </p>
                </div>

                {/* Event Date */}
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CalendarIcon style={{ width: '12px', height: '12px' }} />
                    Event Date
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '8px 0 0 0' }}>
                    {new Date(selectedBooking.eventDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Guest Count */}
                <div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <UserIcon style={{ width: '12px', height: '12px' }} />
                    Guest Count
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '8px 0 0 0' }}>
                    {selectedBooking.guestCount} guests
                  </p>
                </div>

                {/* Location */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPinIcon style={{ width: '12px', height: '12px' }} />
                    Event Location
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '8px 0 0 0' }}>
                    {selectedBooking.eventLocation}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>
                  📋 Items:
                </p>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {selectedBooking.items.map((item, idx) => (
                    <li key={idx} style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div style={{ backgroundColor: '#fffbeb', borderRadius: '8px', padding: '12px', border: '1px solid #fde68a', marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', margin: '0 0 4px 0' }}>
                    ✏️ Special Requests:
                  </p>
                  <p style={{ fontSize: '12px', color: '#b45309', margin: 0 }}>
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}

              {/* Amount */}
              <div style={{ backgroundColor: '#e0e7ff', borderRadius: '8px', padding: '12px', border: '1px solid #c7d2fe', marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#4f46e5', textTransform: 'uppercase', margin: 0 }}>
                  Total Amount
                </p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#4f46e5', margin: '8px 0 0 0' }}>
                  ₹{selectedBooking.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div style={{ padding: '16px', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: '#f1f5f9',
                  color: '#1e293b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}