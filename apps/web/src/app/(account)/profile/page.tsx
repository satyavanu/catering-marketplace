'use client';

import React, { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, type: 'Home', address: '123 Main St, New York, NY 10001' },
    { id: 2, type: 'Work', address: '456 Business Ave, New York, NY 10002' },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Simulate fetching profile data
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setProfileData({
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
        });
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.firstName) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👤 My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
        >
          {isEditing ? 'Cancel' : '✎ Edit Profile'}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <span className="text-lg">✓</span>
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Personal Information Section */}
      <div className="bg-white rounded-lg shadow p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Personal Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
              >
                {loading ? '💾 Saving...' : '💾 Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-white rounded-lg shadow p-8 mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">📍 Saved Addresses</h2>
          <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-all">
            + Add Address
          </button>
        </div>

        <div className="space-y-3">
          {savedAddresses.map((addr) => (
            <div key={addr.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{addr.type}</p>
                  <p className="text-gray-600 text-sm mt-1">{addr.address}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition-all">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm font-semibold transition-all">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">⚙️ Preferences</h2>
        
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-all">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
            <div>
              <p className="text-gray-900 font-medium">Email Notifications</p>
              <p className="text-gray-500 text-sm">Receive updates about your orders</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-all">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
            <div>
              <p className="text-gray-900 font-medium">SMS Notifications</p>
              <p className="text-gray-500 text-sm">Receive SMS alerts for important updates</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-all">
            <input
              type="checkbox"
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
            <div>
              <p className="text-gray-900 font-medium">Newsletter</p>
              <p className="text-gray-500 text-sm">Get exclusive offers and new catering services</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-all">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
            <div>
              <p className="text-gray-900 font-medium">Marketing Emails</p>
              <p className="text-gray-500 text-sm">Personalized recommendations and promotions</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}