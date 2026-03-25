'use client';

import { useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  ChevronDownIcon,
  TagIcon,
  UserGroupIcon,
  CalendarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState<'event' | 'subscription'>('event');

  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'Classic Vegetarian',
      description: 'A wonderful selection of vegetarian dishes',
      type: 'event',
      pricing: 'per_person',
      price: 350,
      currency: '₹',
      servings: '20-50',
      items: ['Paneer Tikka', 'Dal Makhani', 'Naan', 'Rice', 'Salad', 'Dessert'],
      addOns: [
        { id: 1, name: 'Extra Naan', price: 50 },
        { id: 2, name: 'Raita', price: 30 },
        { id: 3, name: 'Pickle & Papad', price: 25 },
      ],
      status: 'active',
      createdDate: 'March 15, 2025',
      orders: 12,
    },
    {
      id: 2,
      name: 'Premium Non-Veg',
      description: 'Exquisite meat and seafood specialties',
      type: 'event',
      pricing: 'per_plate',
      price: 500,
      currency: '₹',
      servings: '30-100',
      items: ['Butter Chicken', 'Biryani', 'Tandoori Fish', 'Naan', 'Rice', 'Dessert'],
      addOns: [
        { id: 4, name: 'Cocktail Appetizers', price: 100 },
        { id: 5, name: 'Gulab Jamun', price: 40 },
      ],
      status: 'active',
      createdDate: 'March 10, 2025',
      orders: 8,
    },
  ]);

  const [subscriptions, setSubscriptions] = useState([
    {
      id: 101,
      name: 'Healthy Morning Bundle',
      description: 'Perfect breakfast and light snacks',
      type: 'subscription',
      mealType: 'breakfast',
      duration: 'monthly',
      price: 4999,
      currency: '₹',
      mealsPerWeek: 5,
      daysPerWeek: 5,
      items: {
        breakfast: ['Vegetable Poha', 'Idli Sambar', 'Dosa', 'Fresh Juices', 'Eggs', 'Bread Toast'],
        snacks: ['Samosa', 'Pakora', 'Cookies', 'Fresh Fruits'],
      },
      addOns: [
        { id: 1, name: 'Extra Dessert', price: 500 },
        { id: 2, name: 'Premium Juice', price: 300 },
      ],
      status: 'active',
      createdDate: 'March 1, 2025',
      subscribers: 15,
    },
    {
      id: 102,
      name: 'Lunch Pro Plan',
      description: 'Complete lunch meals for office workers',
      type: 'subscription',
      mealType: 'lunch',
      duration: 'monthly',
      price: 7999,
      currency: '₹',
      mealsPerWeek: 5,
      daysPerWeek: 5,
      items: {
        lunch: ['Biryani', 'Butter Chicken', 'Dal', 'Rice', 'Salad', 'Dessert', 'Bread'],
      },
      addOns: [
        { id: 3, name: 'Extra Rice', price: 100 },
        { id: 4, name: 'Extra Dessert', price: 200 },
      ],
      status: 'active',
      createdDate: 'February 20, 2025',
      subscribers: 22,
    },
    {
      id: 103,
      name: 'Evening Dinner Deluxe',
      description: 'Premium dinner for families',
      type: 'subscription',
      mealType: 'dinner',
      duration: 'monthly',
      price: 12999,
      currency: '₹',
      mealsPerWeek: 6,
      daysPerWeek: 6,
      items: {
        dinner: ['Tandoori Chicken', 'Paneer Tikka Masala', 'Biryani', 'Dal Makhani', 'Naan', 'Rice', 'Salad', 'Dessert'],
      },
      addOns: [
        { id: 5, name: 'Wine Pairing', price: 1000 },
        { id: 6, name: 'Starter Platter', price: 500 },
      ],
      status: 'active',
      createdDate: 'March 5, 2025',
      subscribers: 18,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: activeTab,
    // Event properties
    pricing: 'per_person',
    price: '',
    servings: '',
    items: [] as string[],
    // Subscription properties
    mealType: 'breakfast',
    duration: 'monthly',
    mealsPerWeek: '5',
    daysPerWeek: '5',
    subscriptionItems: {
      breakfast: [] as string[],
      lunch: [] as string[],
      snacks: [] as string[],
      dinner: [] as string[],
    },
    addOns: [] as Array<{ name: string; price: string }>,
  });

  const [itemInput, setItemInput] = useState('');
  const [currentMealType, setCurrentMealType] = useState('breakfast');
  const [addOnInput, setAddOnInput] = useState({ name: '', price: '' });

  const mealTypes = [
    { value: 'breakfast', label: '🌅 Breakfast', icon: '🌅' },
    { value: 'lunch', label: '🍽️ Lunch', icon: '🍽️' },
    { value: 'snacks', label: '🥨 Snacks', icon: '🥨' },
    { value: 'dinner', label: '🌙 Dinner', icon: '🌙' },
  ];

  const handleAddPackage = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      type: activeTab,
      pricing: 'per_person',
      price: '',
      servings: '',
      items: [],
      mealType: 'breakfast',
      duration: 'monthly',
      mealsPerWeek: '5',
      daysPerWeek: '5',
      subscriptionItems: {
        breakfast: [],
        lunch: [],
        snacks: [],
        dinner: [],
      },
      addOns: [],
    });
    setCurrentMealType('breakfast');
    setShowForm(true);
  };

  const handleEditPackage = (pkg: any) => {
    setEditingId(pkg.id);
    if (pkg.type === 'event') {
      setFormData({
        name: pkg.name,
        description: pkg.description,
        type: 'event',
        pricing: pkg.pricing,
        price: pkg.price.toString(),
        servings: pkg.servings,
        items: [...pkg.items],
        mealType: 'breakfast',
        duration: 'monthly',
        mealsPerWeek: '5',
        daysPerWeek: '5',
        subscriptionItems: {
          breakfast: [],
          lunch: [],
          snacks: [],
          dinner: [],
        },
        addOns: pkg.addOns.map((addon: any) => ({ name: addon.name, price: addon.price.toString() })),
      });
    } else {
      setFormData({
        name: pkg.name,
        description: pkg.description,
        type: 'subscription',
        pricing: 'per_person',
        price: pkg.price.toString(),
        servings: '',
        items: [],
        mealType: pkg.mealType,
        duration: pkg.duration,
        mealsPerWeek: pkg.mealsPerWeek.toString(),
        daysPerWeek: pkg.daysPerWeek.toString(),
        subscriptionItems: pkg.items,
        addOns: pkg.addOns.map((addon: any) => ({ name: addon.name, price: addon.price.toString() })),
      });
    }
    setShowForm(true);
  };

  const handleSavePackage = () => {
    if (!formData.name || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.type === 'event') {
      if (editingId) {
        setPackages(
          packages.map((pkg) =>
            pkg.id === editingId
              ? {
                  ...pkg,
                  name: formData.name,
                  description: formData.description,
                  pricing: formData.pricing,
                  price: parseInt(formData.price),
                  servings: formData.servings,
                  items: formData.items,
                  addOns: formData.addOns.map((addon) => ({
                    id: Math.random(),
                    name: addon.name,
                    price: parseInt(addon.price) || 0,
                  })),
                }
              : pkg
          )
        );
      } else {
        const newPackage = {
          id: Math.max(...packages.map((p) => p.id), 0) + 1,
          name: formData.name,
          description: formData.description,
          type: 'event',
          pricing: formData.pricing,
          price: parseInt(formData.price),
          currency: '₹',
          servings: formData.servings,
          items: formData.items,
          addOns: formData.addOns.map((addon) => ({
            id: Math.random(),
            name: addon.name,
            price: parseInt(addon.price) || 0,
          })),
          status: 'active',
          createdDate: new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          orders: 0,
        };
        setPackages([...packages, newPackage]);
      }
    } else {
      if (editingId) {
        setSubscriptions(
          subscriptions.map((sub) =>
            sub.id === editingId
              ? {
                  ...sub,
                  name: formData.name,
                  description: formData.description,
                  mealType: formData.mealType,
                  duration: formData.duration,
                  price: parseInt(formData.price),
                  mealsPerWeek: parseInt(formData.mealsPerWeek),
                  daysPerWeek: parseInt(formData.daysPerWeek),
                  items: formData.subscriptionItems,
                  addOns: formData.addOns.map((addon) => ({
                    id: Math.random(),
                    name: addon.name,
                    price: parseInt(addon.price) || 0,
                  })),
                }
              : sub
          )
        );
      } else {
        const newSubscription = {
          id: Math.max(...subscriptions.map((s) => s.id), 0) + 1,
          name: formData.name,
          description: formData.description,
          type: 'subscription',
          mealType: formData.mealType,
          duration: formData.duration,
          price: parseInt(formData.price),
          currency: '₹',
          mealsPerWeek: parseInt(formData.mealsPerWeek),
          daysPerWeek: parseInt(formData.daysPerWeek),
          items: formData.subscriptionItems,
          addOns: formData.addOns.map((addon) => ({
            id: Math.random(),
            name: addon.name,
            price: parseInt(addon.price) || 0,
          })),
          status: 'active',
          createdDate: new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          subscribers: 0,
        };
        setSubscriptions([...subscriptions, newSubscription]);
      }
    }

    setShowForm(false);
    setFormData({
      name: '',
      description: '',
      type: activeTab,
      pricing: 'per_person',
      price: '',
      servings: '',
      items: [],
      mealType: 'breakfast',
      duration: 'monthly',
      mealsPerWeek: '5',
      daysPerWeek: '5',
      subscriptionItems: {
        breakfast: [],
        lunch: [],
        snacks: [],
        dinner: [],
      },
      addOns: [],
    });
  };

  const handleDeletePackage = (id: number) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter((pkg) => pkg.id !== id));
    }
  };

  const handleDeleteSubscription = (id: number) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    }
  };

  const handleAddItem = () => {
    if (itemInput.trim()) {
      if (formData.type === 'event') {
        setFormData({ ...formData, items: [...formData.items, itemInput.trim()] });
      } else {
        setFormData({
          ...formData,
          subscriptionItems: {
            ...formData.subscriptionItems,
            [currentMealType]: [...formData.subscriptionItems[currentMealType as keyof typeof formData.subscriptionItems], itemInput.trim()],
          },
        });
      }
      setItemInput('');
    }
  };

  const handleRemoveItem = (index: number) => {
    if (formData.type === 'event') {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    } else {
      setFormData({
        ...formData,
        subscriptionItems: {
          ...formData.subscriptionItems,
          [currentMealType]: formData.subscriptionItems[currentMealType as keyof typeof formData.subscriptionItems].filter((_, i) => i !== index),
        },
      });
    }
  };

  const handleAddAddOn = () => {
    if (addOnInput.name.trim() && addOnInput.price) {
      setFormData({
        ...formData,
        addOns: [...formData.addOns, { name: addOnInput.name.trim(), price: addOnInput.price }],
      });
      setAddOnInput({ name: '', price: '' });
    }
  };

  const handleRemoveAddOn = (index: number) => {
    setFormData({
      ...formData,
      addOns: formData.addOns.filter((_, i) => i !== index),
    });
  };

  const getCurrentItems = () => {
    if (formData.type === 'event') {
      return formData.items;
    } else {
      return formData.subscriptionItems[currentMealType as keyof typeof formData.subscriptionItems];
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Packages & Subscriptions</h1>
          <p style={styles.subtitle}>Create event packages and monthly food subscriptions</p>
        </div>
        <button onClick={handleAddPackage} style={styles.buttonPrimary}>
          <PlusIcon style={{ width: '18px', height: '18px' }} />
          {activeTab === 'event' ? 'Create Package' : 'Create Subscription'}
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab('event')}
          style={{
            ...styles.tab,
            ...(activeTab === 'event' ? styles.tabActive : styles.tabInactive),
          }}
        >
          <TagIcon style={{ width: '18px', height: '18px' }} />
          Event Packages ({packages.length})
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          style={{
            ...styles.tab,
            ...(activeTab === 'subscription' ? styles.tabActive : styles.tabInactive),
          }}
        >
          <CalendarIcon style={{ width: '18px', height: '18px' }} />
          Monthly Subscriptions ({subscriptions.length})
        </button>
      </div>

      {/* Statistics */}
      <div style={styles.statsGrid}>
        {activeTab === 'event' ? (
          <>
            <div style={styles.statCard}>
              <div style={styles.statIcon} style={{ backgroundColor: '#dbeafe' }}>
                🎁
              </div>
              <div>
                <p style={styles.statLabel}>Total Packages</p>
                <p style={styles.statValue}>{packages.length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon} style={{ backgroundColor: '#dbeafe' }}>
                ✓
              </div>
              <div>
                <p style={styles.statLabel}>Active Packages</p>
                <p style={styles.statValue}>{packages.filter((p) => p.status === 'active').length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon} style={{ backgroundColor: '#dbeafe' }}>
                📊
              </div>
              <div>
                <p style={styles.statLabel}>Total Orders</p>
                <p style={styles.statValue}>{packages.reduce((sum, p) => sum + p.orders, 0)}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon} style={{ backgroundColor: '#dbeafe' }}>
                💰
              </div>
              <div>
                <p style={styles.statLabel}>Avg Price</p>
                <p style={styles.statValue}>
                  ₹{packages.length > 0 ? Math.round(packages.reduce((sum, p) => sum + p.price, 0) / packages.length) : 0}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={styles.statCard}>
              <div style={styles.statIcon} style={{ backgroundColor: '#dcfce7' }}>
                🍜
              </div>
              <div>
                <p style={styles.statLabel}>Total Subscriptions</p>
                <p style={styles.statValue}>{subscriptions.length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon} style={{ backgroundColor: '#dcfce7' }}>
                👥
              </div>
              <div>
                <p style={styles.statLabel}>Total Subscribers</p>
                <p style={styles.statValue}>{subscriptions.reduce((sum, s) => sum + s.subscribers, 0)}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon} style={{ backgroundColor: '#dcfce7' }}>
                📈
              </div>
              <div>
                <p style={styles.statLabel}>Active Plans</p>
                <p style={styles.statValue}>{subscriptions.filter((s) => s.status === 'active').length}</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statIcon} style={{ backgroundColor: '#dcfce7' }}>
                💵
              </div>
              <div>
                <p style={styles.statLabel}>Avg Monthly</p>
                <p style={styles.statValue}>
                  ₹{subscriptions.length > 0 ? Math.round(subscriptions.reduce((sum, s) => sum + s.price, 0) / subscriptions.length) : 0}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={styles.modal}>
          <div style={styles.modalOverlay} onClick={() => setShowForm(false)} />
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingId ? 'Edit' : 'Create New'} {formData.type === 'event' ? 'Package' : 'Subscription'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={styles.closeButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fee2e2';
                  e.currentTarget.style.color = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                <XMarkIcon style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <div style={styles.modalBody}>
              {/* Package Name & Description */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  {formData.type === 'event' ? 'Package' : 'Subscription'} Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Classic Vegetarian or Healthy Morning Bundle"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  placeholder="Describe your package..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              {/* Event Package Form */}
              {formData.type === 'event' ? (
                <>
                  {/* Pricing Section */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Pricing Type *</label>
                      <select
                        value={formData.pricing}
                        onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                        style={styles.input}
                      >
                        <option value="per_person">Per Person</option>
                        <option value="per_plate">Per Plate</option>
                        <option value="flat_rate">Flat Rate</option>
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Price ({formData.pricing === 'per_person' ? 'Per Person' : formData.pricing === 'per_plate' ? 'Per Plate' : 'Total'}) *
                      </label>
                      <div style={styles.priceInput}>
                        <span style={styles.currencySymbol}>₹</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          style={{ ...styles.input, marginLeft: 0, paddingLeft: '8px' }}
                        />
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Recommended Servings</label>
                      <input
                        type="text"
                        placeholder="e.g., 20-50"
                        value={formData.servings}
                        onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                        style={styles.input}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Subscription Form */}
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Meal Type *</label>
                      <select
                        value={formData.mealType}
                        onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                        style={styles.input}
                      >
                        <option value="breakfast">🌅 Breakfast</option>
                        <option value="lunch">🍽️ Lunch</option>
                        <option value="snacks">🥨 Snacks</option>
                        <option value="dinner">🌙 Dinner</option>
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Duration *</label>
                      <select
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        style={styles.input}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Monthly Price *</label>
                      <div style={styles.priceInput}>
                        <span style={styles.currencySymbol}>₹</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          style={{ ...styles.input, marginLeft: 0, paddingLeft: '8px' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Meals Per Week *</label>
                      <input
                        type="number"
                        placeholder="5"
                        value={formData.mealsPerWeek}
                        onChange={(e) => setFormData({ ...formData, mealsPerWeek: e.target.value })}
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Days Per Week *</label>
                      <input
                        type="number"
                        placeholder="5"
                        value={formData.daysPerWeek}
                        onChange={(e) => setFormData({ ...formData, daysPerWeek: e.target.value })}
                        style={styles.input}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Menu Items */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Menu Items</label>

                {/* Meal Type Tabs for Subscription */}
                {formData.type === 'subscription' && (
                  <div style={styles.mealTypeTabs}>
                    {mealTypes.map((meal) => (
                      <button
                        key={meal.value}
                        onClick={() => setCurrentMealType(meal.value)}
                        style={{
                          ...styles.mealTypeTab,
                          ...(currentMealType === meal.value ? styles.mealTypeTabActive : styles.mealTypeTabInactive),
                        }}
                      >
                        {meal.label}
                      </button>
                    ))}
                  </div>
                )}

                <div style={styles.itemsContainer}>
                  {getCurrentItems().map((item, index) => (
                    <div key={index} style={styles.itemTag}>
                      <span>{item}</span>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        style={styles.removeItemButton}
                      >
                        <XMarkIcon style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  ))}
                </div>
                <div style={styles.addItemRow}>
                  <input
                    type="text"
                    placeholder={`Add ${formData.type === 'subscription' && currentMealType ? currentMealType + ' ' : ''}menu item`}
                    value={itemInput}
                    onChange={(e) => setItemInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddItem();
                      }
                    }}
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <button onClick={handleAddItem} style={styles.addButton}>
                    <PlusIcon style={{ width: '16px', height: '16px' }} />
                    Add
                  </button>
                </div>
              </div>

              {/* Add-ons Section */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Add-ons (Optional)</label>
                <div style={styles.addOnsContainer}>
                  {formData.addOns.map((addOn, index) => (
                    <div key={index} style={styles.addOnItem}>
                      <div>
                        <p style={styles.addOnName}>{addOn.name}</p>
                        <p style={styles.addOnPrice}>₹{addOn.price}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveAddOn(index)}
                        style={styles.removeButton}
                      >
                        <TrashIcon style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={styles.addOnFormRow}>
                  <input
                    type="text"
                    placeholder="Add-on name (e.g., Extra Naan)"
                    value={addOnInput.name}
                    onChange={(e) => setAddOnInput({ ...addOnInput, name: e.target.value })}
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <div style={styles.priceInput}>
                    <span style={styles.currencySymbol}>₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={addOnInput.price}
                      onChange={(e) => setAddOnInput({ ...addOnInput, price: e.target.value })}
                      style={{ ...styles.input, marginLeft: 0, paddingLeft: '8px' }}
                    />
                  </div>
                  <button onClick={handleAddAddOn} style={styles.addButton}>
                    <PlusIcon style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div style={styles.formActions}>
                <button onClick={() => setShowForm(false)} style={styles.buttonSecondary}>
                  Cancel
                </button>
                <button onClick={handleSavePackage} style={styles.buttonPrimary}>
                  {editingId ? 'Update' : 'Create'} {formData.type === 'event' ? 'Package' : 'Subscription'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Packages List */}
      {activeTab === 'event' && (
        <div style={styles.packagesGrid}>
          {packages.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🎁</div>
              <h3 style={styles.emptyTitle}>No event packages yet</h3>
              <p style={styles.emptyText}>Create your first package to get started</p>
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} style={styles.packageCard}>
                <div style={styles.packageHeader}>
                  <div>
                    <h3 style={styles.packageName}>{pkg.name}</h3>
                    <p style={styles.packageDescription}>{pkg.description}</p>
                  </div>
                  <span style={{ ...styles.statusBadge, backgroundColor: '#dcfce7', color: '#166534' }}>
                    {pkg.status}
                  </span>
                </div>

                <div style={styles.priceSection}>
                  <div style={styles.priceBox}>
                    <span style={styles.currency}>₹</span>
                    <span style={styles.price}>{pkg.price}</span>
                    <span style={styles.pricingType}>
                      /{pkg.pricing === 'per_person' ? 'person' : pkg.pricing === 'per_plate' ? 'plate' : 'total'}
                    </span>
                  </div>
                  <div style={styles.servingsBox}>
                    <UserGroupIcon style={{ width: '16px', height: '16px' }} />
                    <span>{pkg.servings} people</span>
                  </div>
                </div>

                <div style={styles.itemsSection}>
                  <p style={styles.sectionTitle}>Menu Items ({pkg.items.length})</p>
                  <div style={styles.itemsList}>
                    {pkg.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} style={styles.itemBadge}>
                        {item}
                      </span>
                    ))}
                    {pkg.items.length > 3 && (
                      <span style={{ ...styles.itemBadge, backgroundColor: '#e5e7eb' }}>
                        +{pkg.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {pkg.addOns.length > 0 && (
                  <div style={styles.addOnsSection}>
                    <p style={styles.sectionTitle}>Add-ons ({pkg.addOns.length})</p>
                    <div style={styles.addOnsList}>
                      {pkg.addOns.map((addon) => (
                        <div key={addon.id} style={styles.addOnBadge}>
                          <span>{addon.name}</span>
                          <span style={styles.addOnPrice}>+₹{addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={styles.statsRow}>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Created</span>
                    <span style={styles.statValue}>{pkg.createdDate}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Orders</span>
                    <span style={styles.statValue}>{pkg.orders}</span>
                  </div>
                </div>

                <div style={styles.packageActions}>
                  <button onClick={() => handleEditPackage(pkg)} style={styles.buttonEdit} title="Edit package">
                    <PencilIcon style={{ width: '16px', height: '16px' }} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    style={styles.buttonDelete}
                    title="Delete package"
                  >
                    <TrashIcon style={{ width: '16px', height: '16px' }} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Subscriptions List */}
      {activeTab === 'subscription' && (
        <div style={styles.packagesGrid}>
          {subscriptions.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🍜</div>
              <h3 style={styles.emptyTitle}>No subscriptions yet</h3>
              <p style={styles.emptyText}>Create your first subscription plan to get started</p>
            </div>
          ) : (
            subscriptions.map((sub) => (
              <div key={sub.id} style={{ ...styles.packageCard, border: '2px solid #10b981' }}>
                <div style={styles.packageHeader}>
                  <div>
                    <h3 style={styles.packageName}>{sub.name}</h3>
                    <p style={styles.packageDescription}>{sub.description}</p>
                  </div>
                  <span style={{ ...styles.statusBadge, backgroundColor: '#10b981', color: 'white' }}>
                    {sub.mealType}
                  </span>
                </div>

                <div style={styles.priceSection}>
                  <div style={styles.priceBox}>
                    <span style={styles.currency}>₹</span>
                    <span style={styles.price}>{sub.price}</span>
                    <span style={styles.pricingType}>/{sub.duration}</span>
                  </div>
                  <div style={{ ...styles.servingsBox, backgroundColor: '#dcfce7', color: '#166534' }}>
                    <CalendarIcon style={{ width: '16px', height: '16px' }} />
                    <span>{sub.daysPerWeek}x/week</span>
                  </div>
                </div>

                <div style={styles.itemsSection}>
                  <p style={styles.sectionTitle}>Meals Included</p>
                  <div style={styles.mealTypeMini}>
                    {Object.entries(sub.items).map(([mealType, items]: [string, any]) => 
                      items.length > 0 && (
                        <div key={mealType} style={styles.mealTypeItem}>
                          <span style={styles.mealTypeLabel}>
                            {mealTypes.find((m) => m.value === mealType)?.icon} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                          </span>
                          <div style={styles.miniItemsList}>
                            {(items as string[]).slice(0, 2).map((item, idx) => (
                              <span key={idx} style={styles.miniItemBadge}>{item}</span>
                            ))}
                            {items.length > 2 && (
                              <span style={{ ...styles.miniItemBadge, backgroundColor: '#e5e7eb' }}>
                                +{items.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {sub.addOns.length > 0 && (
                  <div style={styles.addOnsSection}>
                    <p style={styles.sectionTitle}>Add-ons ({sub.addOns.length})</p>
                    <div style={styles.addOnsList}>
                      {sub.addOns.slice(0, 2).map((addon) => (
                        <div key={addon.id} style={styles.addOnBadge}>
                          <span>{addon.name}</span>
                          <span style={styles.addOnPrice}>+₹{addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={styles.statsRow}>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Created</span>
                    <span style={styles.statValue}>{sub.createdDate}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Subscribers</span>
                    <span style={styles.statValue}>{sub.subscribers}</span>
                  </div>
                </div>

                <div style={styles.packageActions}>
                  <button onClick={() => handleEditPackage(sub)} style={styles.buttonEdit} title="Edit subscription">
                    <PencilIcon style={{ width: '16px', height: '16px' }} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSubscription(sub.id)}
                    style={styles.buttonDelete}
                    title="Delete subscription"
                  >
                    <TrashIcon style={{ width: '16px', height: '16px' }} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '0px',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '8px 8px 0 0',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    backgroundColor: '#2563eb',
    color: 'white',
    borderBottom: '3px solid #2563eb',
  },
  tabInactive: {
    backgroundColor: 'transparent',
    color: '#64748b',
    borderBottom: '3px solid transparent',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    margin: 0,
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '4px 0 0 0',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e2e8f0',
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    color: '#6b7280',
    transition: 'all 0.2s ease',
  },
  modalBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
  },
  priceInput: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  currencySymbol: {
    padding: '10px 12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    borderRight: '1px solid #e2e8f0',
  },
  mealTypeTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  mealTypeTab: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  mealTypeTabActive: {
    backgroundColor: '#2563eb',
    color: 'white',
    borderColor: '#2563eb',
  },
  mealTypeTabInactive: {
    backgroundColor: '#f8fafc',
    color: '#64748b',
    borderColor: '#e2e8f0',
  },
  itemsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  itemTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#dbeafe',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#0c4a6e',
  },
  removeItemButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    color: '#0c4a6e',
    transition: 'all 0.2s ease',
  },
  addItemRow: {
    display: 'flex',
    gap: '8px',
  },
  addButton: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #2563eb',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
  addOnsContainer: {
    display: 'grid',
    gap: '8px',
    marginBottom: '12px',
  },
  addOnItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  addOnName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  addOnPrice: {
    fontSize: '12px',
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  removeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    color: '#dc2626',
    transition: 'all 0.2s ease',
  },
  addOnFormRow: {
    display: 'flex',
    gap: '8px',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  buttonPrimary: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
  buttonSecondary: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: 'white',
    color: '#64748b',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  packagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 40px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  packageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    gap: '12px',
  },
  packageName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  packageDescription: {
    fontSize: '13px',
    color: '#64748b',
    margin: '4px 0 0 0',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
  },
  priceSection: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
  },
  priceBox: {
    flex: 1,
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  currency: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2563eb',
  },
  price: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
  },
  pricingType: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
  },
  servingsBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: '#dbeafe',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#0c4a6e',
    fontWeight: '600',
  },
  itemsSection: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    margin: '0 0 8px 0',
  },
  itemsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  itemBadge: {
    padding: '4px 10px',
    backgroundColor: '#dbeafe',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#0c4a6e',
    fontWeight: '500',
  },
  mealTypeMini: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  mealTypeItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  mealTypeLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1e293b',
  },
  miniItemsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
  },
  miniItemBadge: {
    padding: '2px 8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#4b5563',
  },
  addOnsSection: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
  },
  addOnsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  addOnBadge: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#f0fdf4',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#166534',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e293b',
  },
  packageActions: {
    display: 'flex',
    gap: '8px',
    padding: '16px',
  },
  buttonEdit: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #2563eb',
    backgroundColor: 'white',
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
  buttonDelete: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #dc2626',
    backgroundColor: 'white',
    color: '#dc2626',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
  },
};