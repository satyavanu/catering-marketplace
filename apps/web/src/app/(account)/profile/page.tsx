'use client';

import React, { useState } from 'react';
import {
  User,
  Bell,
  Settings,
  MapPin,
  ChevronRight,
  X,
  Lock,
  Smartphone,
  LogOut,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Shield,
  Clock,
  Globe,
  Moon,
  Sun,
  Download,
  Edit,
  Plus,
  Menu,
  CreditCard,
  TrendingUp,
  Calendar,
  Zap,
  FileText,
  CheckCircle,
  AlertTriangle,
  Upload,
} from 'lucide-react';

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('account');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addresses, setAddresses] = useState([
    { id: 1, street: '123 Main Street', city: 'New York', state: 'NY', country: 'United States', zip: '10001', isDefault: true },
    { id: 2, street: '456 Oak Avenue', city: 'Boston', state: 'MA', country: 'United States', zip: '02101', isDefault: false },
  ]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    streetAddress: '',
    city: '',
    state: '',
    country: 'United States',
    zipCode: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotif: true,
    smsNotif: false,
    pushNotif: true,
    orderUpdates: true,
    promoEmails: false,
    weeklyDigest: true,
  });

  const [preferences, setPreferences] = useState({
    language: 'English',
    theme: 'Light',
    timezone: 'EST',
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  });

  const [logins, setLogins] = useState([
    { id: 1, device: 'Chrome on MacBook', location: 'New York, US', lastActive: '2 minutes ago', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'New York, US', lastActive: '2 hours ago', current: false },
    { id: 3, device: 'Chrome on Windows', location: 'Boston, MA', lastActive: '1 day ago', current: false },
  ]);

  const [isPartner, setIsPartner] = useState(true);
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  const [partnerData, setPartnerData] = useState({
    membershipType: 'Pro',
    membershipStartDate: 'March 15, 2024',
    membershipEndDate: 'March 15, 2025',
    daysRemaining: 287,
    restaurantName: 'Delicious Catering Co.',
    restaurantEmail: 'contact@deliciouscatering.com',
    businessRegistration: 'REG-2024-001',
    rating: 4.8,
    totalOrders: 342,
    totalRevenue: '₹2,45,670',
    verificationStatus: 'Verified',
    nextBillingDate: 'April 15, 2025',
    monthlyAmount: '₹4,999',
    autoRenewal: true,
  });

  const [subscriptionTransactions, setSubscriptionTransactions] = useState([
    {
      id: 1,
      date: 'March 15, 2025',
      type: 'Renewal',
      description: 'Pro Plan - Annual Renewal',
      amount: '₹4,999',
      status: 'Completed',
      transactionId: 'TXN-2025-001',
      invoiceUrl: '#',
    },
    {
      id: 2,
      date: 'March 10, 2025',
      type: 'Upgrade',
      description: 'Upgraded from Basic to Pro',
      amount: '₹2,499',
      status: 'Completed',
      transactionId: 'TXN-2025-002',
      invoiceUrl: '#',
    },
    {
      id: 3,
      date: 'March 15, 2024',
      type: 'Initial',
      description: 'Pro Plan - Initial Subscription',
      amount: '₹4,999',
      status: 'Completed',
      transactionId: 'TXN-2024-001',
      invoiceUrl: '#',
    },
    {
      id: 4,
      date: 'February 15, 2024',
      type: 'Initial',
      description: 'Basic Plan - Initial Subscription',
      amount: '₹1,999',
      status: 'Completed',
      transactionId: 'TXN-2024-002',
      invoiceUrl: '#',
    },
  ]);

  const [membershipPlans, setMembershipPlans] = useState([
    {
      id: 'basic',
      name: 'Basic',
      price: '₹1,999',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        'Up to 50 menu items',
        'Basic analytics',
        'Email support',
        'Standard commission rate (15%)',
        'Mobile app access',
      ],
      current: partnerData.membershipType === 'Basic',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹4,999',
      period: '/month',
      description: 'Best for growing businesses',
      features: [
        'Up to 500 menu items',
        'Advanced analytics',
        'Priority support',
        'Reduced commission rate (10%)',
        'Mobile app access',
        'API access',
        'Custom branding',
      ],
      current: partnerData.membershipType === 'Pro',
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₹9,999',
      period: '/month',
      description: 'For established restaurants',
      features: [
        'Unlimited menu items',
        'Full analytics suite',
        'Dedicated account manager',
        'Premium commission rate (5%)',
        'Mobile app access',
        'API access',
        'Custom branding',
        'Multi-location support',
        'Marketing tools',
      ],
      current: partnerData.membershipType === 'Premium',
    },
  ]);

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    ...(isPartner ? [
      { id: 'membership', label: 'Membership', icon: Zap },
      { id: 'verification', label: 'Business Verification', icon: FileText },
    ] : []),
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'logins', label: 'Logins', icon: Smartphone },
  ];

  const handleAddAddress = () => {
    if (formData.streetAddress && formData.city && formData.state && formData.country && formData.zipCode) {
      if (editingAddressId) {
        setAddresses(
          addresses.map((addr) =>
            addr.id === editingAddressId
              ? {
                  ...addr,
                  street: formData.streetAddress,
                  city: formData.city,
                  state: formData.state,
                  country: formData.country,
                  zip: formData.zipCode,
                }
              : addr
          )
        );
        setEditingAddressId(null);
      } else {
        setAddresses([
          ...addresses,
          {
            id: Date.now(),
            street: formData.streetAddress,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zip: formData.zipCode,
            isDefault: false,
          },
        ]);
      }
      setFormData({
        ...formData,
        streetAddress: '',
        city: '',
        state: '',
        country: 'United States',
        zipCode: '',
      });
      setShowAddressForm(false);
    }
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleEditAddress = (address) => {
    setFormData({
      ...formData,
      streetAddress: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zip,
    });
    setEditingAddressId(address.id);
    setShowAddressForm(true);
  };

  const handleLogoutDevice = (id) => {
    setLogins(logins.filter((login) => login.id !== id));
  };

  const handleUpgradeMembership = (planId) => {
    const planName = membershipPlans.find((p) => p.id === planId)?.name;
    alert(`Upgrading to ${planName} plan. Processing payment...`);
    setPartnerData({ ...partnerData, membershipType: planName });
    setShowMembershipModal(false);
  };

  const InputField = ({ label, type = 'text', value, onChange, placeholder, disabled }) => (
    <div style={styles.formGroup}>
      <label style={styles.formLabel}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          ...styles.input,
          ...(disabled && { backgroundColor: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed' }),
        }}
      />
    </div>
  );

  const ToggleSwitch = ({ label, description, checked, onChange }) => (
    <div style={styles.toggleCard}>
      <div>
        <p style={styles.toggleLabel}>{label}</p>
        {description && <p style={styles.toggleDescription}>{description}</p>}
      </div>
      <label style={styles.switch}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ display: 'none' }}
        />
        <div style={{ ...styles.switchTrack, backgroundColor: checked ? '#2563eb' : '#d1d5db' }}>
          <div
            style={{
              ...styles.switchThumb,
              transform: checked ? 'translateX(24px)' : 'translateX(0)',
            }}
          />
        </div>
      </label>
    </div>
  );

  const renderAccountSection = () => (
    <div>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitleGroup}>
          <div style={{ ...styles.sectionIcon, backgroundColor: '#eff6ff' }}>
            <User size={24} color="#0c4a6e" />
          </div>
          <div>
            <h2 style={styles.sectionTitle}>Account Information</h2>
            <p style={styles.sectionSubtitle}>Update your personal details</p>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Personal Details</h3>
        </div>
        <div style={styles.cardBody}>
          <InputField
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Enter your full name"
          />
          <InputField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@example.com"
            disabled
          />
          <p style={styles.inputHint}>Email cannot be changed. Contact support to update.</p>
          <InputField
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
          <button style={styles.buttonPrimary}>Save Changes</button>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Account Status</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.statusInfo}>
            <div>
              <p style={styles.statusLabel}>Account Created</p>
              <p style={styles.statusValue}>March 15, 2024</p>
            </div>
            <div>
              <p style={styles.statusLabel}>Last Updated</p>
              <p style={styles.statusValue}>March 20, 2026</p>
            </div>
            <div>
              <p style={styles.statusLabel}>Account Status</p>
              <span style={styles.activeStatus}>Active</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...styles.card, borderColor: '#fee2e2', backgroundColor: '#fef2f2' }}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Danger Zone</h3>
        </div>
        <div style={styles.cardBody}>
          <p style={styles.dangerText}>Deleting your account is permanent and cannot be undone.</p>
          <button
            onClick={() => setShowDeleteModal(true)}
            style={styles.buttonDanger}
          >
            <Trash2 size={18} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitleGroup}>
          <div style={{ ...styles.sectionIcon, backgroundColor: '#fef3c7' }}>
            <Bell size={24} color="#92400e" />
          </div>
          <div>
            <h2 style={styles.sectionTitle}>Notification Preferences</h2>
            <p style={styles.sectionSubtitle}>Control how we communicate with you</p>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Notification Channels</h3>
        </div>
        <div style={styles.cardBody}>
          <ToggleSwitch
            label="Email Notifications"
            description="Receive important updates via email"
            checked={notifications.emailNotif}
            onChange={(e) => setNotifications({ ...notifications, emailNotif: e.target.checked })}
          />
          <ToggleSwitch
            label="SMS Notifications"
            description="Receive text message alerts"
            checked={notifications.smsNotif}
            onChange={(e) => setNotifications({ ...notifications, smsNotif: e.target.checked })}
          />
          <ToggleSwitch
            label="Push Notifications"
            description="Receive in-app notifications"
            checked={notifications.pushNotif}
            onChange={(e) => setNotifications({ ...notifications, pushNotif: e.target.checked })}
          />
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Content Preferences</h3>
        </div>
        <div style={styles.cardBody}>
          <ToggleSwitch
            label="Order Updates"
            description="Get notified about your orders"
            checked={notifications.orderUpdates}
            onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
          />
          <ToggleSwitch
            label="Promotional Emails"
            description="Receive special offers and deals"
            checked={notifications.promoEmails}
            onChange={(e) => setNotifications({ ...notifications, promoEmails: e.target.checked })}
          />
          <ToggleSwitch
            label="Weekly Digest"
            description="Get a weekly summary of activities"
            checked={notifications.weeklyDigest}
            onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
          />
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitleGroup}>
          <div style={{ ...styles.sectionIcon, backgroundColor: '#e0e7ff' }}>
            <Settings size={24} color="#3730a3" />
          </div>
          <div>
            <h2 style={styles.sectionTitle}>Preferences</h2>
            <p style={styles.sectionSubtitle}>Customize your experience</p>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Regional Settings</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Language</label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              style={styles.input}
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
              <option>Japanese</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Timezone</label>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
              style={styles.input}
            >
              <option value="PST">Pacific Standard Time (PST)</option>
              <option value="MST">Mountain Standard Time (MST)</option>
              <option value="CST">Central Standard Time (CST)</option>
              <option value="EST">Eastern Standard Time (EST)</option>
              <option value="GMT">Greenwich Mean Time (GMT)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Display Settings</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.themeGrid}>
            {['Light', 'Dark', 'Auto'].map((theme) => (
              <button
                key={theme}
                onClick={() => setPreferences({ ...preferences, theme })}
                style={{
                  ...styles.themeButton,
                  ...(preferences.theme === theme ? styles.themeButtonActive : styles.themeButtonInactive),
                }}
              >
                {theme === 'Light' && <Sun size={20} />}
                {theme === 'Dark' && <Moon size={20} />}
                {theme === 'Auto' && <Globe size={20} />}
                <span>{theme}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitleGroup}>
          <div style={{ ...styles.sectionIcon, backgroundColor: '#dcfce7' }}>
            <Shield size={24} color="#166534" />
          </div>
          <div>
            <h2 style={styles.sectionTitle}>Privacy & Security</h2>
            <p style={styles.sectionSubtitle}>Control your privacy settings</p>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Profile Visibility</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Who can see your profile</label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
              style={styles.input}
            >
              <option value="private">Private (Only you)</option>
              <option value="friends">Friends Only</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Contact Information Visibility</h3>
        </div>
        <div style={styles.cardBody}>
          <ToggleSwitch
            label="Show Email Address"
            description="Allow others to see your email"
            checked={privacy.showEmail}
            onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
          />
          <ToggleSwitch
            label="Show Phone Number"
            description="Allow others to see your phone number"
            checked={privacy.showPhone}
            onChange={(e) => setPrivacy({ ...privacy, showPhone: e.target.checked })}
          />
          <ToggleSwitch
            label="Allow Direct Messages"
            description="Let others send you messages"
            checked={privacy.allowMessages}
            onChange={(e) => setPrivacy({ ...privacy, allowMessages: e.target.checked })}
          />
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Data & Privacy</h3>
        </div>
        <div style={styles.cardBody}>
          <button style={styles.buttonSecondary}>
            <Download size={18} />
            Download My Data
          </button>
        </div>
      </div>
    </div>
  );

  const renderAddressesSection = () => (
    <div>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitleGroup}>
          <div style={{ ...styles.sectionIcon, backgroundColor: '#fce7f3' }}>
            <MapPin size={24} color="#be185d" />
          </div>
          <div>
            <h2 style={styles.sectionTitle}>Saved Addresses</h2>
            <p style={styles.sectionSubtitle}>Manage your delivery addresses</p>
          </div>
        </div>
        <span style={styles.badge}>{addresses.length}/10</span>
      </div>

      {addresses.length < 10 && (
        <button
          onClick={() => {
            setEditingAddressId(null);
            setFormData({
              ...formData,
              streetAddress: '',
              city: '',
              state: '',
              country: 'United States',
              zipCode: '',
            });
            setShowAddressForm(!showAddressForm);
          }}
          style={styles.buttonAdd}
        >
          <Plus size={18} />
          {showAddressForm ? 'Cancel' : 'Add Address'}
        </button>
      )}

      {showAddressForm && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
          </div>
          <div style={styles.cardBody}>
            <InputField
              label="Street Address"
              value={formData.streetAddress}
              onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
              placeholder="123 Main Street"
            />
            <div style={styles.formRow}>
              <InputField
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="New York"
              />
              <InputField
                label="State/Province"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="NY"
              />
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  style={styles.input}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="India">India</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Spain">Spain</option>
                  <option value="Italy">Italy</option>
                  <option value="Japan">Japan</option>
                  <option value="China">China</option>
                  <option value="Singapore">Singapore</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Brazil">Brazil</option>
                </select>
              </div>
              <InputField
                label="Zip/Postal Code"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="10001"
              />
            </div>
            <div style={styles.formButtons}>
              <button
                onClick={() => setShowAddressForm(false)}
                style={styles.buttonSecondary}
              >
                Cancel
              </button>
              <button
                onClick={handleAddAddress}
                style={styles.buttonPrimary}
              >
                {editingAddressId ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.addressGrid}>
        {addresses.length === 0 ? (
          <div style={styles.emptyState}>
            <MapPin size={48} style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>No addresses saved</h3>
            <p style={styles.emptyText}>Add an address to get started</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} style={styles.addressCard}>
              <div style={styles.addressCardHeader}>
                <div>
                  <p style={styles.addressTitle}>{addr.street}</p>
                  <p style={styles.addressSubtitle}>
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                  <p style={styles.addressCountry}>{addr.country}</p>
                </div>
                {addr.isDefault && <span style={styles.defaultBadge}>Default</span>}
              </div>
              <div style={styles.addressCardFooter}>
                <button
                  onClick={() => handleEditAddress(addr)}
                  style={styles.buttonSmallEdit}
                >
                  <Edit size={16} />
                  Edit
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefaultAddress(addr.id)}
                    style={styles.buttonSmallSecondary}
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  style={styles.buttonSmallDelete}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderLoginsSection = () => (
    <div>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitleGroup}>
          <div style={{ ...styles.sectionIcon, backgroundColor: '#f0fdf4' }}>
            <Smartphone size={24} color="#166534" />
          </div>
          <div>
            <h2 style={styles.sectionTitle}>Active Sessions</h2>
            <p style={styles.sectionSubtitle}>Manage your active logins</p>
          </div>
        </div>
      </div>

      <div style={styles.loginsList}>
        {logins.map((login) => (
          <div key={login.id} style={styles.loginCard}>
            <div style={styles.loginInfo}>
              <div style={styles.loginIcon}>
                <Smartphone size={20} />
              </div>
              <div style={styles.loginDetails}>
                <div>
                  <p style={styles.loginDevice}>{login.device}</p>
                  <p style={styles.loginLocation}>{login.location}</p>
                </div>
              </div>
            </div>
            <div style={styles.loginActions}>
              <div style={styles.loginStatus}>
                <div style={styles.statusDot} />
                <p style={styles.loginTime}>{login.lastActive}</p>
              </div>
              {!login.current && (
                <button
                  onClick={() => handleLogoutDevice(login.id)}
                  style={styles.buttonSmallDelete}
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...styles.card, marginTop: '24px' }}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Session Security</h3>
        </div>
        <div style={styles.cardBody}>
          <button
            onClick={() => setShowLogoutModal(true)}
            style={styles.buttonDanger}
          >
            <LogOut size={18} />
            Logout All Other Sessions
          </button>
        </div>
      </div>
    </div>
  );

  const renderMembershipSection = () => (
    <div>
      <div style={styles.sectionHeader}>
        <div style={styles.sectionTitleGroup}>
          <div style={{ ...styles.sectionIcon, backgroundColor: '#fef3c7' }}>
            <Zap size={24} color="#92400e" />
          </div>
          <div>
            <h2 style={styles.sectionTitle}>Membership & Subscription</h2>
            <p style={styles.sectionSubtitle}>Manage your partnership plan and billing</p>
          </div>
        </div>
      </div>

      {/* Current Membership Status */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Current Membership</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.membershipStatusGrid}>
            <div style={styles.membershipStatusItem}>
              <div style={styles.statusIconBox} style={{ backgroundColor: '#eff6ff' }}>
                <Zap size={24} color="#0c4a6e" />
              </div>
              <div>
                <p style={styles.statusLabel}>Plan Type</p>
                <p style={styles.statusValueLarge}>{partnerData.membershipType}</p>
              </div>
            </div>

            <div style={styles.membershipStatusItem}>
              <div style={styles.statusIconBox} style={{ backgroundColor: '#fef3c7' }}>
                <Calendar size={24} color="#92400e" />
              </div>
              <div>
                <p style={styles.statusLabel}>Valid Until</p>
                <p style={styles.statusValueLarge}>{partnerData.membershipEndDate}</p>
                <p style={styles.daysRemaining}>{partnerData.daysRemaining} days remaining</p>
              </div>
            </div>

            <div style={styles.membershipStatusItem}>
              <div style={styles.statusIconBox} style={{ backgroundColor: '#dcfce7' }}>
                <Check size={24} color="#166534" />
              </div>
              <div>
                <p style={styles.statusLabel}>Status</p>
                <p style={styles.statusValueLarge}>
                  <span style={styles.verifiedBadge}>{partnerData.verificationStatus}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Billing Information</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.billingGrid}>
            <div style={styles.billingItem}>
              <p style={styles.billingLabel}>Monthly Amount</p>
              <p style={styles.billingValue}>{partnerData.monthlyAmount}</p>
            </div>
            <div style={styles.billingItem}>
              <p style={styles.billingLabel}>Next Billing Date</p>
              <p style={styles.billingValue}>{partnerData.nextBillingDate}</p>
            </div>
            <div style={styles.billingItem}>
              <p style={styles.billingLabel}>Auto Renewal</p>
              <p style={styles.billingValue}>
                <span style={partnerData.autoRenewal ? styles.activeBadge : styles.inactiveBadge}>
                  {partnerData.autoRenewal ? 'Enabled' : 'Disabled'}
                </span>
              </p>
            </div>
          </div>
          <div style={styles.billingInfo}>
            <div style={styles.billingInfoItem}>
              <p style={styles.billingLabel}>Billing Email</p>
              <p style={styles.billingValue}>{partnerData.restaurantEmail}</p>
            </div>
            <div style={styles.billingInfoItem}>
              <p style={styles.billingLabel}>Business Registration</p>
              <p style={styles.billingValue}>{partnerData.businessRegistration}</p>
            </div>
          </div>
          <div style={styles.billingActions}>
            <button style={styles.buttonSecondary}>
              <CreditCard size={18} />
              Update Payment Method
            </button>
            <button style={styles.buttonSecondary}>
              <FileText size={18} />
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Business Overview */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Business Overview</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.businessGrid}>
            <div style={styles.businessItem}>
              <p style={styles.businessLabel}>Restaurant Name</p>
              <p style={styles.businessValue}>{partnerData.restaurantName}</p>
            </div>
            <div style={styles.businessItem}>
              <p style={styles.businessLabel}>Total Orders</p>
              <p style={styles.businessValue}>{partnerData.totalOrders}</p>
            </div>
            <div style={styles.businessItem}>
              <p style={styles.businessLabel}>Rating</p>
              <p style={styles.businessValue}>⭐ {partnerData.rating}</p>
            </div>
            <div style={styles.businessItem}>
              <p style={styles.businessLabel}>Total Revenue</p>
              <p style={styles.businessValue}>{partnerData.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Plans */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Available Plans</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.plansGrid}>
            {membershipPlans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  ...styles.planCard,
                  ...(plan.current && styles.planCardActive),
                  ...(plan.popular && styles.planCardPopular),
                }}
              >
                {plan.popular && <div style={styles.popularBadge}>Most Popular</div>}
                {plan.current && <div style={styles.currentBadge}>Current Plan</div>}

                <h4 style={styles.planName}>{plan.name}</h4>
                <p style={styles.planDescription}>{plan.description}</p>

                <div style={styles.planPrice}>
                  <span style={styles.planPriceAmount}>{plan.price}</span>
                  <span style={styles.planPricePeriod}>{plan.period}</span>
                </div>

                <ul style={styles.planFeatures}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={styles.planFeature}>
                      <Check size={16} color="#10b981" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {!plan.current && (
                  <button
                    onClick={() => {
                      setShowMembershipModal(true);
                      handleUpgradeMembership(plan.id);
                    }}
                    style={plan.popular ? styles.buttonPrimary : styles.buttonSecondary}
                  >
                    {partnerData.membershipType === 'Basic' && plan.name !== 'Basic' ? 'Upgrade' : partnerData.membershipType === 'Premium' && plan.name !== 'Premium' ? 'Downgrade' : 'Change'} to {plan.name}
                  </button>
                )}
                {plan.current && (
                  <button style={{ ...styles.buttonSecondary, opacity: 0.5, cursor: 'not-allowed' }}>
                    Current Plan
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Transactions */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Subscription Transactions</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.transactionsList}>
            {subscriptionTransactions.length === 0 ? (
              <div style={styles.emptyState}>
                <CreditCard size={48} style={styles.emptyIcon} />
                <h3 style={styles.emptyTitle}>No transactions</h3>
                <p style={styles.emptyText}>Your subscription transactions will appear here</p>
              </div>
            ) : (
              subscriptionTransactions.map((transaction) => (
                <div key={transaction.id} style={styles.transactionCard}>
                  <div style={styles.transactionContent}>
                    <div style={styles.transactionIconBox}>
                      {transaction.type === 'Renewal' && <TrendingUp size={20} color="#ffffff" />}
                      {transaction.type === 'Upgrade' && <Zap size={20} color="#ffffff" />}
                      {transaction.type === 'Initial' && <CreditCard size={20} color="#ffffff" />}
                    </div>
                    <div style={styles.transactionDetails}>
                      <div>
                        <p style={styles.transactionDescription}>{transaction.description}</p>
                        <p style={styles.transactionId}>ID: {transaction.transactionId}</p>
                      </div>
                      <p style={styles.transactionDate}>{transaction.date}</p>
                    </div>
                  </div>
                  <div style={styles.transactionFooter}>
                    <p style={styles.transactionAmount}>{transaction.amount}</p>
                    <span
                      style={{
                        ...styles.transactionStatus,
                        backgroundColor:
                          transaction.status === 'Completed'
                            ? '#dcfce7'
                            : transaction.status === 'Pending'
                            ? '#fef3c7'
                            : '#fee2e2',
                        color:
                          transaction.status === 'Completed'
                            ? '#166534'
                            : transaction.status === 'Pending'
                            ? '#92400e'
                            : '#991b1b',
                      }}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Billing Settings */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Billing Settings</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.settingsList}>
            <div style={styles.settingItem}>
              <div>
                <p style={styles.settingLabel}>Auto Renewal</p>
                <p style={styles.settingDescription}>Automatically renew your subscription on the billing date</p>
              </div>
              <label style={styles.switch}>
                <input
                  type="checkbox"
                  checked={partnerData.autoRenewal}
                  onChange={(e) => setPartnerData({ ...partnerData, autoRenewal: e.target.checked })}
                  style={{ display: 'none' }}
                />
                <div style={{ ...styles.switchTrack, backgroundColor: partnerData.autoRenewal ? '#2563eb' : '#d1d5db' }}>
                  <div
                    style={{
                      ...styles.switchThumb,
                      transform: partnerData.autoRenewal ? 'translateX(24px)' : 'translateX(0)',
                    }}
                  />
                </div>
              </label>
            </div>
          </div>
          <div style={styles.billingActions}>
            <button style={styles.buttonDanger}>
              <AlertTriangle size={18} />
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>Payment Methods</h3>
        </div>
        <div style={styles.cardBody}>
          <div style={styles.paymentMethodCard}>
            <div style={styles.paymentMethodIcon}>💳</div>
            <div>
              <p style={styles.paymentMethodName}>Visa Card ending in 4242</p>
              <p style={styles.paymentMethodExpiry}>Expires 12/2026</p>
            </div>
            <span style={styles.defaultPaymentBadge}>Default</span>
          </div>
          <button style={styles.buttonSecondary}>
            <Plus size={18} />
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .profile-mobile-menu-btn {
            display: flex !important;
          }

          .profile-wrapper {
            flex-direction: column !important;
            gap: 0 !important;
          }

          .profile-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100vh !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            z-index: 50 !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease !important;
            overflow-y: auto !important;
          }

          .profile-sidebar.open {
            transform: translateX(0) !important;
          }

          .profile-sidebar-header {
            padding: 1.5rem !important;
          }

          .profile-main-content {
            width: 100% !important;
            z-index: 10 !important;
          }

          .section-title {
            font-size: clamp(1.3rem, 4vw, 1.75rem) !important;
          }

          .form-row {
            grid-template-columns: 1fr !important;
          }

          .address-grid {
            grid-template-columns: 1fr !important;
          }

          .theme-grid {
            grid-template-columns: 1fr !important;
          }

          .status-info {
            grid-template-columns: 1fr !important;
          }

          .login-card {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: flex-start !important;
          }

          .login-actions {
            width: 100% !important;
            justify-content: space-between !important;
            gap: 8px !important;
          }
        }

        @media (max-width: 480px) {
          .profile-sidebar-header {
            padding: 1rem !important;
          }

          .profile-nav {
            gap: 4px !important;
          }

          .container {
            padding: 0.5rem !important;
          }

          .profile-main-content {
            padding: 1rem !important;
          }

          .card-body {
            padding: 1rem !important;
          }

          .button-primary,
          .button-secondary,
          .button-danger {
            font-size: 0.8rem !important;
            padding: 0.6rem 1rem !important;
          }

          .address-grid {
            grid-template-columns: 1fr !important;
          }

          .section-title {
            font-size: 1.25rem !important;
          }
        }
      `}</style>

      <div style={styles.container} className="container">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={styles.mobileMenuBtn}
          className="profile-mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <Menu size={24} color="#111827" />
        </button>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            style={styles.mobileOverlay}
            className="profile-mobile-overlay"
            onClick={() => setMobileMenuOpen(false)}
            role="presentation"
          />
        )}

        <div style={styles.wrapper} className="profile-wrapper">
          {/* Sidebar */}
          <div
            style={{
              ...styles.sidebar,
              ...(mobileMenuOpen ? styles.sidebarOpen : {}),
            }}
            className={`profile-sidebar ${mobileMenuOpen ? 'open' : ''}`}
          >
            <div style={styles.sidebarHeader} className="profile-sidebar-header">
              <div style={styles.sidebarTitleWrapper}>
                <h1 style={styles.sidebarTitle}>Profile</h1>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={styles.closeSidebarBtn}
                  className="profile-close-sidebar"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <p style={styles.sidebarSubtitle}>Manage your account</p>
            </div>
            <nav style={styles.nav} className="profile-nav">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      ...styles.navItem,
                      ...(activeSection === section.id
                        ? styles.navItemActive
                        : styles.navItemInactive),
                    }}
                  >
                    <Icon size={18} />
                    <span>{section.label}</span>
                    {activeSection === section.id && <ChevronRight size={18} />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div style={styles.mainContent} className="profile-main-content">
            {activeSection === 'account' && renderAccountSection()}
            {activeSection === 'notifications' && renderNotificationsSection()}
            {activeSection === 'preferences' && renderPreferencesSection()}
            {activeSection === 'privacy' && renderPrivacySection()}
            {activeSection === 'addresses' && renderAddressesSection()}
            {activeSection === 'logins' && renderLoginsSection()}
            {activeSection === 'membership' && isPartner && renderMembershipSection()}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Delete Account</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>
            <p style={styles.modalDescription}>
              Are you sure you want to delete your account? This action is permanent and cannot be undone.
            </p>
            <div style={styles.warningBox}>
              <AlertCircle size={20} color="#991b1b" />
              <p>All your data will be permanently deleted</p>
            </div>
            <div style={styles.modalButtons}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={styles.buttonSecondary}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={styles.buttonDanger}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Logout All Sessions</h2>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>
            <p style={styles.modalDescription}>
              This will logout all other active sessions. Your current session will remain active.
            </p>
            <div style={styles.modalButtons}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={styles.buttonSecondary}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={styles.buttonPrimary}
              >
                Logout All Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: 'clamp(1rem, 3vw, 2rem)',
  },
  mobileMenuBtn: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    marginBottom: '12px',
    zIndex: 30,
  },
  mobileOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 45,
  },
  wrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    gap: 'clamp(1rem, 3vw, 2rem)',
  },
  sidebar: {
    width: 'clamp(200px, 25vw, 280px)',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: 'clamp(1rem, 2vw, 1.5rem)',
    height: 'fit-content',
    position: 'sticky' as const,
    top: 'clamp(1rem, 2vw, 1.5rem)',
  },
  sidebarOpen: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    borderRadius: 0,
    overflowY: 'auto' as const,
    zIndex: 50,
    padding: 0,
  },
  sidebarHeader: {
    marginBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '16px',
  },
  sidebarTitleWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  closeSidebarBtn: {
    display: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px',
  },
  sidebarTitle: {
    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  sidebarSubtitle: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontWeight: '600',
    width: '100%',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
  },
  navItemInactive: {
    color: '#6b7280',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'clamp(1rem, 3vw, 2rem)',
    minWidth: 0,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  sectionTitleGroup: {
    display: 'flex',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    alignItems: 'flex-start',
    flex: 1,
  },
  sectionIcon: {
    width: 'clamp(40px, 8vw, 56px)',
    height: 'clamp(40px, 8vw, 56px)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    className: 'section-title',
  },
  sectionSubtitle: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '6px',
    paddingBottom: '6px',
    borderRadius: '20px',
    fontSize: 'clamp(0.7rem, 2vw, 0.75rem)',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
  },
  cardHeader: {
    paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
    paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
    paddingTop: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  cardTitle: {
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  cardBody: {
    paddingLeft: 'clamp(1rem, 3vw, 1.5rem)',
    paddingRight: 'clamp(1rem, 3vw, 1.5rem)',
    paddingTop: 'clamp(1rem, 3vw, 1.5rem)',
    paddingBottom: 'clamp(1rem, 3vw, 1.5rem)',
  },
  formGroup: {
    marginBottom: 'clamp(1rem, 2vw, 1.25rem)',
  },
  formLabel: {
    display: 'block',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    paddingLeft: '12px',
    paddingRight: '12px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box' as const,
    backgroundColor: '#ffffff',
  },
  inputHint: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    color: '#9ca3af',
    margin: '6px 0 0 0',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
  },
  formButtons: {
    display: 'flex',
    gap: 'clamp(0.5rem, 2vw, 0.75rem)',
    marginTop: 'clamp(1rem, 3vw, 1.5rem)',
    flexWrap: 'wrap',
  },
  toggleCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
    flexWrap: 'wrap',
    gap: '12px',
  },
  toggleLabel: {
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  toggleDescription: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  switch: {
    position: 'relative' as const,
    display: 'inline-block',
    width: '52px',
    height: '28px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  switchTrack: {
    position: 'absolute' as const,
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#d1d5db',
    transition: 'all 0.3s',
    borderRadius: '34px',
  },
  switchThumb: {
    position: 'absolute' as const,
    content: '""',
    height: '24px',
    width: '24px',
    left: '2px',
    bottom: '2px',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s',
    borderRadius: '50%',
  },
  statusInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
  },
  statusLabel: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  statusValue: {
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    fontWeight: '700',
    color: '#111827',
    marginTop: '4px',
  },
  activeStatus: {
    display: 'inline-block',
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '6px',
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    fontWeight: '600',
    marginTop: '4px',
  },
  themeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'clamp(0.5rem, 2vw, 0.75rem)',
  },
  themeButton: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    paddingTop: '16px',
    paddingBottom: '16px',
    paddingLeft: '12px',
    paddingRight: '12px',
    borderRadius: '8px',
    border: '2px solid #e5e7eb',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontWeight: '600',
    color: '#6b7280',
  },
  themeButtonActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
    color: '#0c4a6e',
  },
  themeButtonInactive: {
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    color: '#6b7280',
  },
  addressGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(250px, 80vw, 320px), 1fr))',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
  },
  addressCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: 'clamp(1rem, 2vw, 1.25rem)',
  },
  addressCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
    flexWrap: 'wrap',
    gap: '8px',
  },
  addressTitle: {
    fontSize: 'clamp(0.85rem, 2vw, 0.875rem)',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  addressSubtitle: {
    fontSize: 'clamp(0.8rem, 1.5vw, 0.8125rem)',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  addressCountry: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    color: '#9ca3af',
    margin: '2px 0 0 0',
    fontWeight: '500',
  },
  defaultBadge: {
    display: 'inline-block',
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '4px',
    fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
    fontWeight: '600',
    whiteSpace: 'nowrap' as const,
  },
  addressCardFooter: {
    display: 'flex',
    gap: 'clamp(0.5rem, 1vw, 0.6rem)',
    flexWrap: 'wrap',
  },
  loginsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'clamp(0.75rem, 2vw, 1rem)',
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: 'clamp(1rem, 2vw, 1.25rem)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  loginInfo: {
    display: 'flex',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    flex: 1,
    minWidth: 0,
  },
  loginIcon: {
    width: 'clamp(40px, 8vw, 48px)',
    height: 'clamp(40px, 8vw, 48px)',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    flexShrink: 0,
  },
  loginDetails: {
    flex: 1,
    minWidth: 0,
  },
  loginDevice: {
    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  loginLocation: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    color: '#6b7280',
    marginTop: '4px',
  },
  loginActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    flexShrink: 0,
  },
  loginStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    flexShrink: 0,
  },
  loginTime: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    color: '#6b7280',
    margin: 0,
    whiteSpace: 'nowrap' as const,
  },
  buttonPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '16px',
    paddingRight: '16px',
    fontWeight: '600',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
  },
  buttonSecondary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '16px',
    paddingRight: '16px',
    fontWeight: '600',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flex: 1,
  },
  buttonDanger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '16px',
    paddingRight: '16px',
    fontWeight: '600',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
  },
  buttonAdd: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '16px',
    paddingRight: '16px',
    fontWeight: '600',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
    width: '100%',
  },
  buttonSmallEdit: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '10px',
    paddingRight: '10px',
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flex: 1,
  },
  buttonSmallSecondary: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    paddingTop: '8px',
    paddingBottom: '8px',
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonSmallDelete: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '10px',
    paddingRight: '10px',
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  dangerText: {
    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
    color: '#6b7280',
    marginBottom: '16px',
  },
  warningBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '24px',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    color: '#991b1b',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 60,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: '480px',
    width: '100%',
    padding: 'clamp(1.5rem, 5vw, 2rem)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  modalTitle: {
    fontSize: 'clamp(1.1rem, 4vw, 1.25rem)',
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
  },
  modalDescription: {
    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
    color: '#6b7280',
    marginBottom: '24px',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: 'clamp(2rem, 8vw, 4rem) clamp(1rem, 3vw, 1.5rem)',
    textAlign: 'center' as const,
  },
  emptyIcon: {
    color: '#d1d5db',
    marginBottom: '16px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  emptyTitle: {
    fontSize: 'clamp(1rem, 3vw, 1.125rem)',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
  },
  membershipStatusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'clamp(1rem, 2vw, 1.5rem)',
  },
  membershipStatusItem: {
    display: 'flex',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    alignItems: 'flex-start',
  },
  statusIconBox: {
    width: 'clamp(45px, 8vw, 56px)',
    height: 'clamp(45px, 8vw, 56px)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusValueLarge: {
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
    fontWeight: '700',
    color: '#111827',
    margin: '8px 0 0 0',
  },
  daysRemaining: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    color: '#10b981',
    marginTop: '4px',
    fontWeight: '600',
  },
  verifiedBadge: {
    display: 'inline-block',
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '6px',
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    fontWeight: '600',
  },
  billingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'clamp(1rem, 2vw, 1.5rem)',
    marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
    paddingBottom: 'clamp(1rem, 2vw, 1.5rem)',
    borderBottom: '1px solid #e5e7eb',
  },
  billingItem: {
    paddingBottom: '12px',
  },
  billingInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'clamp(1rem, 2vw, 1.5rem)',
    marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
  },
  billingInfoItem: {
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
  },
  billingActions: {
    display: 'flex',
    gap: 'clamp(0.5rem, 2vw, 0.75rem)',
    flexWrap: 'wrap',
  },
  businessGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'clamp(1rem, 2vw, 1.5rem)',
  },
  businessItem: {
    textAlign: 'center',
  },
  businessLabel: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    margin: 0,
  },
  businessValue: {
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    fontWeight: '700',
    color: '#111827',
    marginTop: '8px',
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'clamp(1rem, 2vw, 1.5rem)',
  },
  planCard: {
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: 'clamp(1rem, 2vw, 1.5rem)',
    backgroundColor: '#ffffff',
    position: 'relative' as const,
    transition: 'all 0.2s',
  },
  planCardActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  planCardPopular: {
    transform: 'scale(1.05)',
    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)',
  },
  popularBadge: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
    fontWeight: '700',
  },
  currentBadge: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
    fontWeight: '700',
  },
  planName: {
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
    fontWeight: '700',
    color: '#111827',
    marginTop: '8px',
    marginBottom: '4px',
  },
  planDescription: {
    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
    color: '#6b7280',
    margin: '0 0 16px 0',
  },
  planPrice: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: '16px',
  },
  planPriceAmount: {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: '700',
    color: '#111827',
  },
  planPricePeriod: {
    fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)',
    color: '#6b7280',
  },
  planFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: '16px 0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  planFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
    color: '#374151',
  },
  transactionsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'clamp(0.75rem, 1.5vw, 1rem)',
  },
  transactionCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 'clamp(0.75rem, 2vw, 1rem)',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    gap: '12px',
    flexWrap: 'wrap',
  },
  transactionContent: {
    display: 'flex',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    flex: 1,
    minWidth: 0,
  },
  transactionIconBox: {
    width: '40px',
    height: '40px',
    backgroundColor: '#2563eb',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  transactionDetails: {
    flex: 1,
    minWidth: 0,
  },
  transactionDescription: {
    fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  transactionId: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    color: '#9ca3af',
    margin: '4px 0 0 0',
  },
  transactionDate: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    color: '#6b7280',
    margin: 0,
  },
  transactionFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  },
  transactionAmount: {
    fontSize: 'clamp(0.85rem, 1.5vw, 0.875rem)',
    fontWeight: '700',
    color: '#111827',
    minWidth: '80px',
    textAlign: 'right' as const,
  },
  transactionStatus: {
    display: 'inline-block',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '6px',
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    fontWeight: '600',
    whiteSpace: 'nowrap' as const,
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  settingLabel: {
    fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  settingDescription: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  paymentMethodCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(1rem, 2vw, 1.5rem)',
    padding: 'clamp(1rem, 2vw, 1.25rem)',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
  },
  paymentMethodIcon: {
    fontSize: '32px',
  },
  paymentMethodName: {
    fontSize: 'clamp(0.8rem, 1.5vw, 0.875rem)',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  paymentMethodExpiry: {
    fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  defaultPaymentBadge: {
    display: 'inline-block',
    backgroundColor: '#dbeafe',
    color: '#0c4a6e',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingTop: '4px',
    paddingBottom: '4px',
    borderRadius: '6px',
    fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)',
    fontWeight: '600',
    marginLeft: 'auto',
  },
};