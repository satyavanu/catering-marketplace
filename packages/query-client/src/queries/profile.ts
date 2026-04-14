import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession } from '@catering-marketplace/auth';
import { getAuthHeaders } from './menu-items';

export type UserRole = 'customer' | 'caterer' | 'admin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    verified: boolean;
    verificationStatus: VerificationStatus;
    agreedToTerms: boolean;
    dateJoined: string;
    lastLogin?: string;
    profileImage?: string;
    bio?: string;

    // Stats
    activeOrders: number;
    activeSubscriptions: number;
    totalOrders: number;
    totalSpent: number;

    // Address
    defaultAddressId?: number;

    // Caterer specific
    restaurantName?: string;
    businessRegistration?: string;
    rating?: number;
    totalRevenue?: string;
    membershipType?: 'Basic' | 'Pro' | 'Premium';
}

// Mock Data - Notifications
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'NOTIF-001',
        userId: 'USR-001',
        type: 'order',
        priority: 'high',
        title: 'Order Delivered',
        message: 'Your order ORD-101 has been delivered successfully.',
        actionUrl: '/orders/ORD-101',
        read: true,
        createdAt: '2026-03-28T12:45:00Z',
    },
    {
        id: 'NOTIF-002',
        userId: 'USR-001',
        type: 'promotion',
        priority: 'medium',
        title: 'Special Offer',
        message: 'Get 20% off on your next order with code SAVE20',
        actionUrl: '/promos/SAVE20',
        read: false,
        createdAt: '2026-03-27T10:30:00Z',
    },
    {
        id: 'NOTIF-003',
        userId: 'USR-001',
        type: 'subscription',
        priority: 'medium',
        title: 'Subscription Renewed',
        message: 'Your breakfast subscription has been renewed for March 2026.',
        actionUrl: '/subscriptions/SUB-201',
        read: false,
        createdAt: '2026-03-27T08:00:00Z',
    },
    {
        id: 'NOTIF-004',
        userId: 'USR-001',
        type: 'system',
        priority: 'low',
        title: 'Profile Update',
        message: 'Verify your email address to enhance account security.',
        actionUrl: '/profile/verify',
        read: false,
        createdAt: '2026-03-26T14:15:00Z',
    },
];

const MOCK_NOTIFICATION_PREFERENCES: NotificationPreferences = {
    id: 'NOTIF-PREF-001',
    userId: 'USR-001',
    emailOnOrderConfirmation: true,
    emailOnDeliveryUpdate: true,
    emailOnPromotion: true,
    emailOnReview: false,
    pushOnOrderUpdate: true,
    pushOnDelivery: true,
    pushOnPromotion: false,
    smsOnDelivery: true,
    smsOnPaymentIssue: true,
    marketingEmails: true,
    weeklyNewsletter: false,
    updatedAt: '2026-03-20T10:00:00Z',
};

const MOCK_USER_PREFERENCES: UserPreferences = {
    id: 'PREF-001',
    userId: 'USR-001',
    theme: 'light',
    language: 'en',
    currency: 'USD',
    dietaryRestrictions: ['vegetarian'],
    cuisinePreferences: ['Indian', 'Italian'],
    defaultDeliverySlot: 'LUNCH',
    autoReorder: false,
    updatedAt: '2026-03-15T09:30:00Z',
};

const MOCK_LOGIN_SESSIONS: LoginSession[] = [
    {
        id: 'SESSION-001',
        userId: 'USR-001',
        deviceName: 'MacBook Pro',
        deviceType: 'web',
        ipAddress: '192.168.1.100',
        location: 'New York, NY',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        lastActivity: '2026-03-27T14:30:00Z',
        createdAt: '2026-03-20T08:00:00Z',
        expiresAt: '2026-04-20T08:00:00Z',
        isCurrent: true,
    },
    {
        id: 'SESSION-002',
        userId: 'USR-001',
        deviceName: 'iPhone 14',
        deviceType: 'mobile',
        ipAddress: '203.0.113.45',
        location: 'New York, NY',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)',
        lastActivity: '2026-03-26T19:45:00Z',
        createdAt: '2026-03-15T10:30:00Z',
        expiresAt: '2026-04-15T10:30:00Z',
        isCurrent: false,
    },
];


const MOCK_ACTIVE_ACCOUNTS: ActiveAccount[] = [
    {
        id: 'ACC-001',
        userId: 'USR-001',
        accountType: 'primary',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        isActive: true,
        lastUsed: '2026-03-27T14:30:00Z',
        createdAt: '2024-03-15T10:00:00Z',
    },
    {
        id: 'ACC-002',
        userId: 'USR-001',
        accountType: 'secondary',
        email: 'john.work@company.com',
        phone: '+1 (555) 987-6543',
        isActive: true,
        lastUsed: '2026-03-25T09:15:00Z',
        createdAt: '2024-08-20T14:00:00Z',
    },
];

export interface UserPreferences {
    id: string;
    userId: string;

    // Display preferences
    theme: 'light' | 'dark' | 'system';
    language: string;
    currency: string;

    // Food preferences
    dietaryRestrictions: string[];
    cuisinePreferences: string[];

    // Order preferences
    defaultDeliverySlot?: 'BREAKFAST' | 'LUNCH' | 'DINNER';
    preferredCuisine?: string[];
    autoReorder: boolean;

    updatedAt: string;
}

export interface LoginSession {
    id: string;
    userId: string;
    deviceName: string;
    deviceType: 'web' | 'mobile' | 'tablet';
    ipAddress: string;
    location: string;
    userAgent: string;
    lastActivity: string;
    createdAt: string;
    expiresAt: string;
    isCurrent: boolean;
}

export interface ActiveAccount {
    id: string;
    userId: string;
    accountType: 'primary' | 'secondary';
    email: string;
    phone: string;
    isActive: boolean;
    lastUsed: string;
    createdAt: string;
}

// In-memory stores
let mockNotifications: Notification[] = [...MOCK_NOTIFICATIONS];
let mockNotificationPreferences: NotificationPreferences = { ...MOCK_NOTIFICATION_PREFERENCES };
let mockUserPreferences: UserPreferences = { ...MOCK_USER_PREFERENCES };
let mockLoginSessions: LoginSession[] = [...MOCK_LOGIN_SESSIONS];
let mockActiveAccounts: ActiveAccount[] = [...MOCK_ACTIVE_ACCOUNTS];

export type NotificationType = 'order' | 'subscription' | 'promotion' | 'system' | 'review';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    actionUrl?: string;
    read: boolean;
    createdAt: string;
}

export const accountKeys = {
    all: ['accounts'] as const,
    lists: () => [...accountKeys.all, 'list'] as const,
    detail: (id: string) => [...accountKeys.all, id] as const,
};


export interface NotificationPreferences {
    id: string;
    userId: string;

    // Email notifications
    emailOnOrderConfirmation: boolean;
    emailOnDeliveryUpdate: boolean;
    emailOnPromotion: boolean;
    emailOnReview: boolean;

    // Push notifications
    pushOnOrderUpdate: boolean;
    pushOnDelivery: boolean;
    pushOnPromotion: boolean;

    // SMS notifications
    smsOnDelivery: boolean;
    smsOnPaymentIssue: boolean;

    // General
    marketingEmails: boolean;
    weeklyNewsletter: boolean;

    updatedAt: string;
}


export interface UpdateProfileInput {
    fullName?: string;
    phone?: string;
    profileImage?: string;
    bio?: string;
    defaultAddressId?: number;
}

export interface CatererProfileUpdate extends UpdateProfileInput {
    restaurantName?: string;
    bio?: string;
}

export interface ProfileResponse {
    data: UserProfile;
    message: string;
    timestamp: string;
}

// Mock Data
const MOCK_CUSTOMER_PROFILE: UserProfile = {
    id: 'USR-001',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'customer',
    verified: true,
    verificationStatus: 'verified',
    agreedToTerms: true,
    dateJoined: 'March 15, 2024',
    lastLogin: 'March 27, 2026 at 10:30 AM',
    profileImage: 'https://api.example.com/avatars/john-doe.jpg',
    bio: 'Food enthusiast and regular customer',

    activeOrders: 2,
    activeSubscriptions: 1,
    totalOrders: 15,
    totalSpent: 8500,

    defaultAddressId: 1,
};

const MOCK_CATERER_PROFILE: UserProfile = {
    id: 'CAT-001',
    fullName: 'Ravi Kumar',
    email: 'contact@deliciouscatering.com',
    phone: '+91-9876543210',
    role: 'caterer',
    verified: true,
    verificationStatus: 'verified',
    agreedToTerms: true,
    dateJoined: 'February 10, 2024',
    lastLogin: 'March 27, 2026 at 02:15 PM',
    profileImage: 'https://api.example.com/avatars/ravi-kumar.jpg',
    bio: 'Professional caterer with 10+ years experience',

    activeOrders: 5,
    activeSubscriptions: 3,
    totalOrders: 342,
    totalSpent: 0,

    restaurantName: 'Delicious Catering Co.',
    businessRegistration: 'REG-2024-001',
    rating: 4.8,
    totalRevenue: '₹2,45,670',
    membershipType: 'Pro',
};

// In-memory store for mock data
let mockProfile: UserProfile = MOCK_CUSTOMER_PROFILE;


// Extended Query Keys
export const notificationKeys = {
    all: ['notifications'] as const,
    lists: () => [...notificationKeys.all, 'list'] as const,
    list: (filters?: { read?: boolean; type?: NotificationType }) =>
        [...notificationKeys.lists(), { filters }] as const,
    detail: (id: string) => [...notificationKeys.all, id] as const,
    preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

export const preferenceKeys = {
    all: ['preferences'] as const,
    detail: () => [...preferenceKeys.all, 'detail'] as const,
};

export const sessionKeys = {
    all: ['sessions'] as const,
    lists: () => [...sessionKeys.all, 'list'] as const,
    detail: (id: string) => [...sessionKeys.all, id] as const,
};


// Extended API Functions - Notifications
export const notificationApi = {
    getNotifications: async (filters?: {
        read?: boolean;
        type?: NotificationType;
    }): Promise<Notification[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));

            let notifications = [...mockNotifications];

            if (filters?.read !== undefined) {
                notifications = notifications.filter(n => n.read === filters.read);
            }

            if (filters?.type) {
                notifications = notifications.filter(n => n.type === filters.type);
            }

            return notifications.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }

        const params = new URLSearchParams();
        if (filters?.read !== undefined) params.append('read', String(filters.read));
        if (filters?.type) params.append('type', filters.type);

        const res = await fetch(
            `${API_BASE_URL}/notifications${params.toString() ? `?${params}` : ''}`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
            }
        );
        if (!res.ok) throw new Error('Failed to fetch notifications');
        return res.json();
    },

    markNotificationAsRead: async (id: string): Promise<Notification> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));

            const notif = mockNotifications.find(n => n.id === id);
            if (!notif) throw new Error('Notification not found');

            notif.read = true;
            return notif;
        }

        const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (!res.ok) throw new Error('Failed to mark notification as read');
        return res.json();
    },

    markAllNotificationsAsRead: async (): Promise<{ count: number }> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));

            const unreadCount = mockNotifications.filter(n => !n.read).length;
            mockNotifications.forEach(n => {
                n.read = true;
            });

            return { count: unreadCount };
        }

        const res = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (!res.ok) throw new Error('Failed to mark all notifications as read');
        return res.json();
    },

    deleteNotification: async (id: string): Promise<void> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));

            const index = mockNotifications.findIndex(n => n.id === id);
            if (index === -1) throw new Error('Notification not found');

            mockNotifications.splice(index, 1);
            return;
        }

        const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (!res.ok) throw new Error('Failed to delete notification');
    },

    getNotificationPreferences: async (): Promise<NotificationPreferences> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return { ...mockNotificationPreferences };
        }

        const res = await fetch(`${API_BASE_URL}/notifications/preferences`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (!res.ok) throw new Error('Failed to fetch notification preferences');
        return res.json();
    },

    updateNotificationPreferences: async (
        data: Partial<NotificationPreferences>
    ): Promise<NotificationPreferences> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));

            mockNotificationPreferences = {
                ...mockNotificationPreferences,
                ...data,
                updatedAt: new Date().toISOString(),
            };

            return { ...mockNotificationPreferences };
        }

        const res = await fetch(`${API_BASE_URL}/notifications/preferences`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update notification preferences');
        return res.json();
    },
};

// Extended API Functions - Preferences
export const preferenceApi = {
    getUserPreferences: async (): Promise<UserPreferences> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return { ...mockUserPreferences };
        }

        const res = await fetch(`${API_BASE_URL}/preferences`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user preferences');
        return res.json();
    },

    updateUserPreferences: async (data: Partial<UserPreferences>): Promise<UserPreferences> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));

            mockUserPreferences = {
                ...mockUserPreferences,
                ...data,
                updatedAt: new Date().toISOString(),
            };

            return { ...mockUserPreferences };
        }

        const res = await fetch(`${API_BASE_URL}/preferences`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update preferences');
        return res.json();
    },
};

// Extended API Functions - Sessions
export const sessionApi = {
    getLoginSessions: async (): Promise<LoginSession[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return [...mockLoginSessions];
        }

        const res = await fetch(`${API_BASE_URL}/sessions`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (!res.ok) throw new Error('Failed to fetch login sessions');
        return res.json();
    },

    revokeSession: async (id: string): Promise<void> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));

            const index = mockLoginSessions.findIndex(s => s.id === id);
            if (index === -1) throw new Error('Session not found');

            mockLoginSessions.splice(index, 1);
            return;
        }

        const res = await fetch(`${API_BASE_URL}/sessions/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (!res.ok) throw new Error('Failed to revoke session');
    },

    revokeAllSessions: async (): Promise<void> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));

            mockLoginSessions = mockLoginSessions.filter(s => s.isCurrent);
            return;
        }

        const res = await fetch(`${API_BASE_URL}/sessions/revoke-all`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (!res.ok) throw new Error('Failed to revoke all sessions');
    },
};

// Extended API Functions - Accounts
export const accountApi = {
    getActiveAccounts: async (): Promise<ActiveAccount[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));
            return [...mockActiveAccounts];
        }

        const res = await fetch(`${API_BASE_URL}/accounts`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (!res.ok) throw new Error('Failed to fetch active accounts');
        return res.json();
    },

    deactivateAccount: async (id: string): Promise<ActiveAccount> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));

            const account = mockActiveAccounts.find(a => a.id === id);
            if (!account) throw new Error('Account not found');

            account.isActive = false;
            return { ...account };
        }

        const res = await fetch(`${API_BASE_URL}/accounts/${id}/deactivate`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (!res.ok) throw new Error('Failed to deactivate account');
        return res.json();
    },

    switchAccount: async (id: string): Promise<ActiveAccount> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));

            mockActiveAccounts.forEach(acc => {
                acc.lastUsed = new Date().toISOString();
            });

            const targetAccount = mockActiveAccounts.find(a => a.id === id);
            if (!targetAccount) throw new Error('Account not found');

            return { ...targetAccount };
        }

        const res = await fetch(`${API_BASE_URL}/accounts/${id}/switch`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        });
        if (!res.ok) throw new Error('Failed to switch account');
        return res.json();
    },
};

// Query Keys
export const profileKeys = {
    all: ['profile'] as const,
    detail: () => [...profileKeys.all, 'detail'] as const,
    settings: () => [...profileKeys.all, 'settings'] as const,
};

// API Functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = true; // Set to false when real API is ready

export const profileApi = {
    // GET user profile
    getProfile: async (): Promise<ProfileResponse> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));

            return {
                data: mockProfile,
                message: 'Profile fetched successfully',
                timestamp: new Date().toISOString(),
            };
        }

        const res = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
    },

    // GET profile by ID (admin/system use)
    getProfileById: async (id: string): Promise<ProfileResponse> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));

            // For demo, return the mock profile regardless of ID
            return {
                data: mockProfile,
                message: 'Profile fetched successfully',
                timestamp: new Date().toISOString(),
            };
        }

        const res = await fetch(`${API_BASE_URL}/profile/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
    },

    // UPDATE user profile
    updateProfile: async (data: UpdateProfileInput): Promise<ProfileResponse> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));

            mockProfile = {
                ...mockProfile,
                ...data,
            };

            return {
                data: mockProfile,
                message: 'Profile updated successfully',
                timestamp: new Date().toISOString(),
            };
        }

        const res = await fetch(`${API_BASE_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update profile');
        return res.json();
    },

    // UPDATE caterer profile (includes restaurant info)
    updateCatererProfile: async (data: CatererProfileUpdate): Promise<ProfileResponse> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));

            mockProfile = {
                ...mockProfile,
                ...data,
            };

            return {
                data: mockProfile,
                message: 'Caterer profile updated successfully',
                timestamp: new Date().toISOString(),
            };
        }

        const res = await fetch(`${API_BASE_URL}/profile/caterer`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update caterer profile');
        return res.json();
    },

    // UPDATE profile picture
    updateProfilePicture: async (file: File): Promise<ProfileResponse> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Slightly longer for "upload"

            // Generate a data URL for the image (demo only)
            const reader = new FileReader();
            reader.onload = (e) => {
                mockProfile.profileImage = e.target?.result as string;
            };
            reader.readAsDataURL(file);

            return {
                data: mockProfile,
                message: 'Profile picture updated successfully',
                timestamp: new Date().toISOString(),
            };
        }

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_BASE_URL}/profile/picture`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: formData,
        });
        if (!res.ok) throw new Error('Failed to upload profile picture');
        return res.json();
    },

    // VERIFY email
    verifyEmail: async (code: string): Promise<ProfileResponse> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));

            if (code === '000000') {
                // Demo code
                mockProfile = {
                    ...mockProfile,
                    verified: true,
                    verificationStatus: 'verified',
                };

                return {
                    data: mockProfile,
                    message: 'Email verified successfully',
                    timestamp: new Date().toISOString(),
                };
            }

            throw new Error('Invalid verification code');
        }

        const res = await fetch(`${API_BASE_URL}/profile/verify-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify({ code }),
        });
        if (!res.ok) throw new Error('Failed to verify email');
        return res.json();
    },

    // REQUEST verification code
    requestVerificationCode: async (): Promise<{ message: string }> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));

            return {
                message: `Verification code sent to ${mockProfile.email}. Use code: 000000 for demo`,
            };
        }

        const res = await fetch(`${API_BASE_URL}/profile/request-verification`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
        });
        if (!res.ok) throw new Error('Failed to request verification code');
        return res.json();
    },

    // CHANGE password
    changePassword: async (
        currentPassword: string,
        newPassword: string
    ): Promise<{ message: string }> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));

            if (currentPassword !== 'password123') {
                throw new Error('Current password is incorrect');
            }

            return {
                message: 'Password changed successfully',
            };
        }

        const res = await fetch(`${API_BASE_URL}/profile/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        });
        if (!res.ok) throw new Error('Failed to change password');
        return res.json();
    },

    // AGREE to terms
    agreeToTerms: async (): Promise<ProfileResponse> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));

            mockProfile = {
                ...mockProfile,
                agreedToTerms: true,
            };

            return {
                data: mockProfile,
                message: 'Terms accepted successfully',
                timestamp: new Date().toISOString(),
            };
        }

        const res = await fetch(`${API_BASE_URL}/profile/agree-terms`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
        });
        if (!res.ok) throw new Error('Failed to agree to terms');
        return res.json();
    },

    // DELETE account
    deleteAccount: async (password: string): Promise<{ message: string }> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));

            if (password !== 'password123') {
                throw new Error('Password is incorrect');
            }

            // Reset mock data
            mockProfile = { ...MOCK_CUSTOMER_PROFILE };

            return {
                message: 'Account deleted successfully',
            };
        }

        const res = await fetch(`${API_BASE_URL}/profile`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify({ password }),
        });
        if (!res.ok) throw new Error('Failed to delete account');
        return res.json();
    },

    // GET profile stats
    getProfileStats: async (): Promise<{
        activeOrders: number;
        activeSubscriptions: number;
        totalOrders: number;
        totalSpent: number;
        memberSince: string;
    }> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));

            return {
                activeOrders: mockProfile.activeOrders,
                activeSubscriptions: mockProfile.activeSubscriptions,
                totalOrders: mockProfile.totalOrders,
                totalSpent: mockProfile.totalSpent,
                memberSince: mockProfile.dateJoined,
            };
        }

        const res = await fetch(`${API_BASE_URL}/profile/stats`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
        });
        if (!res.ok) throw new Error('Failed to fetch profile stats');
        return res.json();
    },

};

// Hooks
export const useProfile = () => {
    return useQuery({
        queryKey: profileKeys.detail(),
        queryFn: () => profileApi.getProfile(),
        staleTime: 1000 * 60 * 10, // 10 minutes
        retry: 1,
    });
};

export const useProfileById = (id: string) => {
    return useQuery({
        queryKey: [...profileKeys.detail(), id],
        queryFn: () => profileApi.getProfileById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10,
    });
};

export const useProfileStats = () => {
    return useQuery({
        queryKey: [...profileKeys.detail(), 'stats'],
        queryFn: () => profileApi.getProfileStats(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileInput) => profileApi.updateProfile(data),
        onSuccess: (response) => {
            queryClient.setQueryData(profileKeys.detail(), response);
            queryClient.invalidateQueries({ queryKey: profileKeys.settings() });
        },
        onError: (error) => {
            console.error('Failed to update profile:', error);
        },
    });
};

export const useUpdateCatererProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CatererProfileUpdate) => profileApi.updateCatererProfile(data),
        onSuccess: (response) => {
            queryClient.setQueryData(profileKeys.detail(), response);
            queryClient.invalidateQueries({ queryKey: profileKeys.settings() });
        },
        onError: (error) => {
            console.error('Failed to update caterer profile:', error);
        },
    });
};

export const useUpdateProfilePicture = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => profileApi.updateProfilePicture(file),
        onSuccess: (response) => {
            queryClient.setQueryData(profileKeys.detail(), response);
        },
        onError: (error) => {
            console.error('Failed to upload profile picture:', error);
        },
    });
};

export const useVerifyEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (code: string) => profileApi.verifyEmail(code),
        onSuccess: (response) => {
            queryClient.setQueryData(profileKeys.detail(), response);
        },
        onError: (error) => {
            console.error('Failed to verify email:', error);
        },
    });
};

export const useRequestVerificationCode = () => {
    return useMutation({
        mutationFn: () => profileApi.requestVerificationCode(),
        onError: (error) => {
            console.error('Failed to request verification code:', error);
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: ({
            currentPassword,
            newPassword,
        }: {
            currentPassword: string;
            newPassword: string;
        }) => profileApi.changePassword(currentPassword, newPassword),
        onError: (error) => {
            console.error('Failed to change password:', error);
        },
    });
};

export const useAgreeToTerms = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => profileApi.agreeToTerms(),
        onSuccess: (response) => {
            queryClient.setQueryData(profileKeys.detail(), response);
        },
        onError: (error) => {
            console.error('Failed to agree to terms:', error);
        },
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (password: string) => profileApi.deleteAccount(password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: profileKeys.all });
        },
        onError: (error) => {
            console.error('Failed to delete account:', error);
        },
    });
};

// Helper functions
export const resetMockProfile = (role: UserRole = 'customer') => {
    mockProfile =
        role === 'caterer' ? { ...MOCK_CATERER_PROFILE } : { ...MOCK_CUSTOMER_PROFILE };
};

export const getMockProfile = () => mockProfile;

export const updateMockProfileRole = (role: UserRole) => {
    resetMockProfile(role);
};

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = '₹'): string => {
    return `${currency}${amount.toLocaleString('en-IN')}`;
};

// Helper function to calculate days since joined
export const getDaysSinceJoined = (dateJoined: string): number => {
    const joinDate = new Date(dateJoined);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// Helper function to get verification badge color
export const getVerificationBadgeColor = (status: VerificationStatus): string => {
    switch (status) {
        case 'verified':
            return '#dcfce7';
        case 'pending':
            return '#fef3c7';
        case 'rejected':
            return '#fee2e2';
        case 'unverified':
        default:
            return '#f3f4f6';
    }
};

// Helper function to get verification badge text color
export const getVerificationBadgeTextColor = (status: VerificationStatus): string => {
    switch (status) {
        case 'verified':
            return '#166534';
        case 'pending':
            return '#92400e';
        case 'rejected':
            return '#991b1b';
        case 'unverified':
        default:
            return '#6b7280';
    }
};


export const useDeleteNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notificationApi.deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
        },
    });
};

export const useNotificationPreferences = () => {
    return useQuery({
        queryKey: notificationKeys.preferences(),
        queryFn: () => notificationApi.getNotificationPreferences(),
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
};

export const useUpdateNotificationPreferences = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<NotificationPreferences>) =>
            notificationApi.updateNotificationPreferences(data),
        onSuccess: (response) => {
            queryClient.setQueryData(notificationKeys.preferences(), response);
        },
    });
};

// Extended Hooks - Preferences
export const useUserPreferences = () => {
    return useQuery({
        queryKey: preferenceKeys.detail(),
        queryFn: () => preferenceApi.getUserPreferences(),
        staleTime: 1000 * 60 * 30,
    });
};

export const useUpdateUserPreferences = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<UserPreferences>) => preferenceApi.updateUserPreferences(data),
        onSuccess: (response) => {
            queryClient.setQueryData(preferenceKeys.detail(), response);
        },
    });
};

// Extended Hooks - Sessions
export const useLoginSessions = () => {
    return useQuery({
        queryKey: sessionKeys.lists(),
        queryFn: () => sessionApi.getLoginSessions(),
        staleTime: 1000 * 60 * 5,
    });
};

export const useRevokeSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => sessionApi.revokeSession(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
        },
    });
};

export const useRevokeAllSessions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => sessionApi.revokeAllSessions(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
        },
    });
};

// Extended Hooks - Accounts
export const useActiveAccounts = () => {
    return useQuery({
        queryKey: accountKeys.lists(),
        queryFn: () => accountApi.getActiveAccounts(),
        staleTime: 1000 * 60 * 30,
    });
};

export const useDeactivateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => accountApi.deactivateAccount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
        },
    });
};

export const useSwitchAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => accountApi.switchAccount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
            queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
        },
    });
};

// Helper functions - Reset mocks
export const resetMockNotifications = () => {
    mockNotifications = [...MOCK_NOTIFICATIONS];
    mockNotificationPreferences = { ...MOCK_NOTIFICATION_PREFERENCES };
    mockUserPreferences = { ...MOCK_USER_PREFERENCES };
    mockLoginSessions = [...MOCK_LOGIN_SESSIONS];
    mockActiveAccounts = [...MOCK_ACTIVE_ACCOUNTS];
};

export const getUnreadNotificationCount = (): number => {
    return mockNotifications.filter(n => !n.read).length;
};

export const getActiveSessions = (): LoginSession[] => {
    return mockLoginSessions.filter(
        s => new Date(s.expiresAt) > new Date()
    );
};


export const useNotifications = (filters?: {
    read?: boolean;
    type?: NotificationType;
}) => {
    return useQuery({
        queryKey: notificationKeys.list(filters),
        queryFn: () => notificationApi.getNotifications(filters),
        staleTime: 1000 * 60 * 1, // 1 minute
        refetchInterval: 1000 * 60 * 1, // Refetch every minute
    });
};

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notificationApi.markNotificationAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
        },
    });
};

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => notificationApi.markAllNotificationsAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
        },
    });
};







// Add new interface for onboarding data
export interface OnboardingData {
    agreeTerms: boolean;
    agreePrivacy: boolean;
    emailMarketing: boolean;
    smsMarketing: boolean;
    pushNotifications: boolean;
}

export interface OnboardingResponse {
    data: {
        profile: UserProfile;
        preferences: NotificationPreferences;
    };
    message: string;
    timestamp: string;
}


// New Query Keys
export const onboardingKeys = {
    all: ['onboarding'] as const,
    complete: () => [...onboardingKeys.all, 'complete'] as const,
};





