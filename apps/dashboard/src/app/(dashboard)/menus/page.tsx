'use client';

import React, { useState } from 'react';

export default function MenusPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // All menus data
  const [menus, setMenus] = useState([
    {
      id: 1,
      name: 'Wedding Package',
      category: 'Events',
      price: '$85',
      servings: '100 people',
      items: ['Appetizers', 'Main Course', 'Dessert', 'Beverages'],
      status: 'Available',
      seasonal: false,
      image: '💍',
    },
    {
      id: 2,
      name: 'Corporate Lunch',
      category: 'Corporate',
      price: '$45',
      servings: '50 people',
      items: ['Sandwich Platters', 'Salads', 'Drinks'],
      status: 'Available',
      seasonal: false,
      image: '💼',
    },
    {
      id: 3,
      name: 'Birthday Package',
      category: 'Events',
      price: '$55',
      servings: '30 people',
      items: ['Pizza', 'Cake', 'Beverages', 'Decorations'],
      status: 'Available',
      seasonal: false,
      image: '🎂',
    },
    {
      id: 4,
      name: 'Summer Buffet',
      category: 'Buffet',
      price: '$35',
      servings: '20 people',
      items: ['Grilled Items', 'Fresh Salads', 'Desserts'],
      status: 'Available',
      seasonal: true,
      image: '🌞',
    },
    {
      id: 5,
      name: 'Holiday Special',
      category: 'Seasonal',
      price: '$65',
      servings: '40 people',
      items: ['Traditional Dishes', 'Festive Desserts', 'Hot Beverages'],
      status: 'Available',
      seasonal: true,
      image: '🎄',
    },
    {
      id: 6,
      name: 'Buffet Menu',
      category: 'Buffet',
      price: '$40',
      servings: '25 people',
      items: ['Appetizers', 'Mains', 'Sides', 'Desserts'],
      status: 'Available',
      seasonal: false,
      image: '🍽️',
    },
  ]);

  // Menu items for individual menus
  const [menuItems] = useState([
    { id: 1, name: 'Italian Pasta Pack', category: 'Mains', price: '$45', servings: '10 people', status: 'Available' },
    { id: 2, name: 'Grilled Chicken Platter', category: 'Mains', price: '$55', servings: '10 people', status: 'Available' },
    { id: 3, name: 'Mediterranean Salad', category: 'Sides', price: '$25', servings: '8 people', status: 'Available' },
    { id: 4, name: 'Chocolate Dessert Box', category: 'Desserts', price: '$35', servings: '12 pieces', status: 'Out of Stock' },
    { id: 5, name: 'Fresh Fruit Platters', category: 'Sides', price: '$30', servings: '15 people', status: 'Available' },
  ]);

  // Pricing packages
  const [pricingPackages] = useState([
    {
      id: 1,
      name: 'Basic Package',
      price: '$25',
      servings: '10',
      items: 3,
      description: 'Perfect for small gatherings',
    },
    {
      id: 2,
      name: 'Standard Package',
      price: '$45',
      servings: '20',
      items: 5,
      description: 'Great for medium events',
    },
    {
      id: 3,
      name: 'Premium Package',
      price: '$75',
      servings: '50',
      items: 8,
      description: 'Ideal for large celebrations',
    },
    {
      id: 4,
      name: 'Deluxe Package',
      price: '$120',
      servings: '100',
      items: 12,
      description: 'Complete catering solution',
    },
  ]);

  // Categories
  const categories = ['Events', 'Corporate', 'Buffet', 'Seasonal', 'Custom'];

  // Seasonal menus
  const seasonalMenus = menus.filter((m) => m.seasonal);

  // Form state
  const [newMenu, setNewMenu] = useState({
    name: '',
    category: 'Events',
    price: '',
    servings: '',
  });

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const tabsStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #e5e7eb',
    overflowX: 'auto' as const,
  };

  const tabButtonStyle = (isActive: boolean) => ({
    padding: '0.75rem 1.5rem',
    backgroundColor: isActive ? '#667eea' : 'transparent',
    color: isActive ? 'white' : '#6b7280',
    border: 'none',
    borderRadius: '0.5rem 0.5rem 0 0',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.2s ease',
  });

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    border: '1px solid #f0f0f0',
  };

  const buttonStyle = {
    padding: '0.625rem 1.25rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
  };

  const handleAddMenu = () => {
    if (newMenu.name && newMenu.price && newMenu.servings) {
      const menu = {
        id: menus.length + 1,
        ...newMenu,
        items: [],
        status: 'Available',
        seasonal: false,
        image: '🍽️',
      };
      setMenus([...menus, menu]);
      setNewMenu({ name: '', category: 'Events', price: '', servings: '' });
      setShowModal(false);
    }
  };

  const handleDeleteMenu = (id: number) => {
    setMenus(menus.filter((m) => m.id !== id));
  };

  const filteredMenus = menus.filter((menu) => {
    const matchesCategory = filterCategory === 'all' || menu.category === filterCategory;
    const matchesSearch =
      menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
          Menu Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          style={buttonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
        >
          + Create Menu
        </button>
      </div>

      {/* Tabs Navigation */}
      <div style={tabsStyle}>
        {[
          { id: 'all', label: '📋 All Menus' },
          { id: 'create', label: '➕ Create Menu' },
          { id: 'categories', label: '📂 Categories' },
          { id: 'pricing', label: '💰 Pricing Packages' },
          { id: 'seasonal', label: '🌸 Seasonal Menus' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={tabButtonStyle(activeTab === tab.id)}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* All Menus Tab */}
      {activeTab === 'all' && (
        <div>
          {/* Search and Filter */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder="Search menus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem',
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#667eea')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Menus Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filteredMenus.map((menu) => (
              <div key={menu.id} style={cardStyle}>
                {/* Card Header */}
                <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                      <div style={{ fontSize: '2rem' }}>{menu.image}</div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>
                          {menu.name}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                          {menu.category}
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: menu.status === 'Available' ? '#d1fae5' : '#fee2e2',
                        color: menu.status === 'Available' ? '#065f46' : '#991b1b',
                        borderRadius: '0.25rem',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                      }}
                    >
                      {menu.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0' }}>
                      <strong>Price:</strong> {menu.price}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0' }}>
                      <strong>Servings:</strong> {menu.servings}
                    </p>
                    {menu.items.length > 0 && (
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
                        <strong>Items:</strong> {menu.items.length}
                      </p>
                    )}
                  </div>

                  {menu.seasonal && (
                    <div style={{ backgroundColor: '#fef3c7', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#92400e', fontWeight: 500 }}>
                      🌸 Seasonal Menu
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#ecf0ff',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#667eea',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dbe9ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ecf0ff')}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(menu.id)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
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
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMenus.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem' }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No menus found. Create your first menu!</p>
            </div>
          )}
        </div>
      )}

      {/* Create Menu Tab */}
      {activeTab === 'create' && (
        <div style={cardStyle}>
          <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', margin: 0 }}>
              Create New Menu
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Menu Name *
                </label>
                <input
                  type="text"
                  value={newMenu.name}
                  onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                  placeholder="e.g., Wedding Package"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Category *
                </label>
                <select
                  value={newMenu.category}
                  onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Price *
                </label>
                <input
                  type="text"
                  value={newMenu.price}
                  onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
                  placeholder="e.g., $45"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Servings *
                </label>
                <input
                  type="text"
                  value={newMenu.servings}
                  onChange={(e) => setNewMenu({ ...newMenu, servings: e.target.value })}
                  placeholder="e.g., 20 people"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleAddMenu}
                style={buttonStyle}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
              >
                Create Menu
              </button>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '0.625rem 1.25rem',
                  backgroundColor: '#e5e7eb',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div style={cardStyle}>
          <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', margin: 0 }}>
              Menu Categories
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {categories.map((category, idx) => {
                const count = menus.filter((m) => m.category === category).length;
                const colors = ['#667eea', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
                return (
                  <div
                    key={category}
                    style={{
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      backgroundColor: colors[idx % colors.length] + '15',
                      border: `2px solid ${colors[idx % colors.length]}`,
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>
                      {['🎊', '💼', '🍽️', '🌸', '🎨'][idx % 5]}
                    </p>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
                      {category}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                      {count} menu{count !== 1 ? 's' : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pricing Packages Tab */}
      {activeTab === 'pricing' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', margin: 0 }}>
            Pricing Packages
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {pricingPackages.map((pkg) => (
              <div key={pkg.id} style={cardStyle}>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
                    {pkg.name}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                    {pkg.description}
                  </p>

                  <div style={{ backgroundColor: '#ecf0ff', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
                      Price per person
                    </p>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#667eea', margin: 0 }}>
                      {pkg.price}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: 0, marginBottom: '0.25rem' }}>
                        Servings
                      </p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                        {pkg.servings}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: 0, marginBottom: '0.25rem' }}>
                        Menu Items
                      </p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                        {pkg.items}
                      </p>
                    </div>
                  </div>

                  <button
                    style={buttonStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
                  >
                    Edit Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal Menus Tab */}
      {activeTab === 'seasonal' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', margin: 0 }}>
            🌸 Seasonal Menus
          </h2>

          {seasonalMenus.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {seasonalMenus.map((menu) => (
                <div key={menu.id} style={cardStyle}>
                  <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                        <div style={{ fontSize: '2rem' }}>{menu.image}</div>
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0, marginBottom: '0.25rem' }}>
                            {menu.name}
                          </h3>
                          <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: '500' }}>
                            Limited Time Offer
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '1rem' }}>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                      <strong>Price:</strong> {menu.price}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
                      <strong>Servings:</strong> {menu.servings}
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          backgroundColor: '#ecf0ff',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#667eea',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dbe9ff')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ecf0ff')}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '0.5rem',
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
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem' }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                No seasonal menus available. Create one to offer limited-time dishes!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Menu Modal */}
      {showModal && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              style={cardStyle}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '2rem', maxWidth: '500px', width: '90vw' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', margin: 0 }}>
                  Create New Menu
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      Menu Name *
                    </label>
                    <input
                      type="text"
                      value={newMenu.name}
                      onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                      placeholder="e.g., Wedding Package"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      Category *
                    </label>
                    <select
                      value={newMenu.category}
                      onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      Price *
                    </label>
                    <input
                      type="text"
                      value={newMenu.price}
                      onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
                      placeholder="e.g., $45"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      Servings *
                    </label>
                    <input
                      type="text"
                      value={newMenu.servings}
                      onChange={(e) => setNewMenu({ ...newMenu, servings: e.target.value })}
                      placeholder="e.g., 20 people"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleAddMenu}
                    style={buttonStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5568d3')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
                  >
                    Create Menu
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      padding: '0.625rem 1.25rem',
                      backgroundColor: '#e5e7eb',
                      color: '#1f2937',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}