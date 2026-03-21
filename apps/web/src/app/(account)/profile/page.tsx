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
} from 'lucide-react';

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('account');
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

  const sections = [
    { id: 'account', label: 'Account', icon: User },
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

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h1 style={styles.sidebarTitle}>Profile</h1>
            <p style={styles.sidebarSubtitle}>Manage your account</p>
          </div>
          <nav style={styles.nav}>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
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
        <div style={styles.mainContent}>
          {activeSection === 'account' && renderAccountSection()}
          {activeSection === 'notifications' && renderNotificationsSection()}
          {activeSection === 'preferences' && renderPreferencesSection()}
          {activeSection === 'privacy' && renderPrivacySection()}
          {activeSection === 'addresses' && renderAddressesSection()}
          {activeSection === 'logins' && renderLoginsSection()}
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
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px',
  },
  wrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    gap: '32px',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '24px',
    height: 'fit-content',
    position: 'sticky',
    top: '24px',
  },
  sidebarHeader: {
    marginBottom: '24px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '16px',
  },
  sidebarTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
  },
  sidebarSubtitle: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '4px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
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
    fontSize: '14px',
    fontWeight: '600',
    width: '100%',
    justifyContent: 'space-between',
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
    flexDirection: 'column',
    gap: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionTitleGroup: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  sectionIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px',
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
    fontSize: '12px',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  cardHeader: {
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
  },
  cardBody: {
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '24px',
    paddingBottom: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
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
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
  },
  inputHint: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '6px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  toggleCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  toggleLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
  },
  toggleDescription: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '52px',
    height: '28px',
    cursor: 'pointer',
  },
  switchTrack: {
    position: 'absolute',
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
    position: 'absolute',
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
    gap: '16px',
  },
  statusLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  statusValue: {
    fontSize: '16px',
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
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '4px',
  },
  themeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  themeButton: {
    display: 'flex',
    flexDirection: 'column',
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
    fontSize: '14px',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
  },
  addressCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '20px',
  },
  addressCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
  },
  addressTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  addressSubtitle: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  addressCountry: {
    fontSize: '12px',
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
    fontSize: '11px',
    fontWeight: '600',
  },
  addressCardFooter: {
    display: 'flex',
    gap: '8px',
  },
  loginsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loginInfo: {
    display: 'flex',
    gap: '16px',
    flex: 1,
  },
  loginIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
  },
  loginDetails: {
    flex: 1,
  },
  loginDevice: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
  },
  loginLocation: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  loginActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
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
  },
  loginTime: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
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
    fontSize: '14px',
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
    fontSize: '14px',
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
    fontSize: '14px',
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
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '24px',
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
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonSmallSecondary: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    paddingTop: '8px',
    paddingBottom: '8px',
    fontSize: '12px',
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
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  dangerText: {
    fontSize: '14px',
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
    fontSize: '14px',
    color: '#991b1b',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 50,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: '480px',
    width: '100%',
    padding: '32px',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  modalTitle: {
    fontSize: '20px',
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
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '64px 24px',
    textAlign: 'center',
  },
  emptyIcon: {
    color: '#d1d5db',
    marginBottom: '16px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  emptyText: {
    color: '#6b7280',
  },
};