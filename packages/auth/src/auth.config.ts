import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import type { NextAuthOptions, User as NextAuthUser } from 'next-auth';

declare module 'next-auth' {
  interface User {
    permissions?: string[];
    refreshToken?: string;
    accessToken?: string;
    tokenExpiresIn?: number;
    tokenExpiresAt?: number;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    isOnboardingCompleted?: boolean;
  }

  interface CustomUser extends NextAuthUser {
    permissions?: string[];
    refreshToken?: string;
    accessToken?: string;
    tokenExpiresIn?: number;
    tokenExpiresAt?: number;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    isOnboardingCompleted?: boolean;
  }
}
import { verifyOtpApi } from '../../query-client/src';

// Role types
export type UserRole = 'customer' | 'caterer' | 'admin' | 'moderator' | 'support' | 'partner';

// User status type
export type OnboardingStatus = 'pending' | 'in_progress' | 'completed';

// Mock database of users with roles
const mockUsers: Record<
  string,
  {
    id: string;
    email: string;
    phone?: string;
    name: string;
    image: string;
    role?: UserRole;
    permissions?: string[];
    isVerified: boolean;
    status: 'active' | 'inactive' | 'suspended';
    onboarding: {
      status: OnboardingStatus;
      completedAt?: Date;
      selectedRole?: UserRole;
    };
  }
> = {
  'demo@example.com': {
    id: '1',
    email: 'demo@example.com',
    phone: '+919876543210',
    name: 'John Doe',
    image: 'https://i.pravatar.cc/150?img=1',
    role: 'customer',
    isVerified: true,
    status: 'active',
    onboarding: {
      status: 'completed',
      completedAt: new Date('2024-01-15'),
      selectedRole: 'customer',
    },
    permissions: ['read:events', 'create:orders', 'read:profile'],
  },
  'caterer@example.com': {
    id: '2',
    email: 'caterer@example.com',
    phone: '+919876543211',
    name: 'Chef Maria',
    image: 'https://i.pravatar.cc/150?img=2',
    role: 'caterer',
    isVerified: true,
    status: 'active',
    onboarding: {
      status: 'completed',
      completedAt: new Date('2024-01-10'),
      selectedRole: 'caterer',
    },
    permissions: [
      'create:menu',
      'update:menu',
      'create:packages',
      'read:orders',
      'update:orders',
      'read:dashboard',
      'read:analytics',
    ],
  },
  'admin@example.com': {
    id: '3',
    email: 'admin@example.com',
    phone: '+919876543212',
    name: 'Admin User',
    image: 'https://i.pravatar.cc/150?img=3',
    role: 'admin',
    isVerified: true,
    status: 'active',
    onboarding: {
      status: 'completed',
      completedAt: new Date('2024-01-05'),
      selectedRole: 'admin',
    },
    permissions: [
      'read:all',
      'write:all',
      'delete:all',
      'manage:users',
      'manage:roles',
      'read:analytics',
      'read:reports',
    ],
  },
  'moderator@example.com': {
    id: '4',
    email: 'moderator@example.com',
    phone: '+919876543213',
    name: 'Sarah Moderator',
    image: 'https://i.pravatar.cc/150?img=4',
    role: 'moderator',
    isVerified: true,
    status: 'active',
    onboarding: {
      status: 'completed',
      completedAt: new Date('2024-01-12'),
      selectedRole: 'moderator',
    },
    permissions: [
      'read:orders',
      'moderate:reviews',
      'moderate:disputes',
      'read:users',
      'report:issues',
    ],
  },
  'support@example.com': {
    id: '5',
    email: 'support@example.com',
    phone: '+919876543214',
    name: 'Support Team',
    image: 'https://i.pravatar.cc/150?img=5',
    role: 'support',
    isVerified: true,
    status: 'active',
    onboarding: {
      status: 'completed',
      completedAt: new Date('2024-01-08'),
      selectedRole: 'support',
    },
    permissions: [
      'read:orders',
      'read:users',
      'respond:tickets',
      'escalate:issues',
      'read:analytics',
    ],
  },
  'partner@example.com': {
    id: '6',
    email: 'partner@example.com',
    phone: '+919876543215',
    name: 'Partner Corp',
    image: 'https://i.pravatar.cc/150?img=6',
    role: 'partner',
    isVerified: true,
    status: 'active',
    onboarding: {
      status: 'completed',
      completedAt: new Date('2024-01-20'),
      selectedRole: 'partner',
    },
    permissions: [
      'read:events',
      'create:events',
      'read:analytics',
      'manage:partnership',
      'read:reports',
    ],
  },
  'newuser@example.com': {
    id: '7',
    email: 'newuser@example.com',
    name: 'New User',
    image: 'https://i.pravatar.cc/150?img=7',
    isVerified: false,
    status: 'active',
    onboarding: {
      status: 'pending',
      selectedRole: undefined,
    },
  },
};

// Role-based permissions mapping
const rolePermissions: Record<UserRole, string[]> = {
  customer: [
    'read:events',
    'create:orders',
    'read:profile',
    'update:profile',
    'cancel:orders',
    'read:reviews',
    'create:reviews',
  ],
  caterer: [
    'create:menu',
    'update:menu',
    'delete:menu',
    'create:packages',
    'update:packages',
    'delete:packages',
    'read:orders',
    'update:orders',
    'read:dashboard',
    'read:analytics',
    'create:subscription',
    'update:subscription',
  ],
  admin: [
    'read:all',
    'write:all',
    'delete:all',
    'manage:users',
    'manage:roles',
    'manage:permissions',
    'read:analytics',
    'read:reports',
    'moderate:platform',
    'read:system',
  ],
  moderator: [
    'read:orders',
    'moderate:reviews',
    'moderate:disputes',
    'read:users',
    'report:issues',
    'escalate:issues',
    'read:analytics',
    'manage:flags',
  ],
  support: [
    'read:orders',
    'read:users',
    'respond:tickets',
    'escalate:issues',
    'read:analytics',
    'create:ticket',
    'update:ticket',
    'send:notifications',
  ],
  partner: [
    'read:events',
    'create:events',
    'read:analytics',
    'manage:partnership',
    'read:reports',
    'create:integrations',
    'read:dashboard',
  ],
};

/**
 * Helper function to find user by email or phone in mock database
 */
function findUserByIdentifier(identifier: string): any {
  if (mockUsers[identifier]) {
    return mockUsers[identifier];
  }

  const userByPhone = Object.values(mockUsers).find(
    (user) => user.phone === identifier
  );

  return userByPhone || null;
}

/**
 * Helper function to fetch user data from backend
 */
async function fetchUserByIdentifier(identifier: string): Promise<any> {
  try {
    // Try mock database first
    const user = findUserByIdentifier(identifier);
    if (user) {
      return {
        success: true,
        user,
      };
    }

    return { success: false, message: 'User not found' };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, message: 'Failed to fetch user' };
  }
}

/**
 * Helper function to verify OTP with backend using verifyOtpApi
 * Payload: { email?: string, phone?: string, otp: string }
 */
async function verifyOtpWithBackend(credentials): Promise<any> {
  try {
    if (!credentials.otp) {
      return { success: false, verified: false, message: 'OTP is required' };
    }

    const result = await verifyOtpApi(credentials);

    return result;
  } catch (error) {
    console.error('Error verifying OTP with backend:', error);
    return {
      success: false,
      verified: false,
      message: 'OTP verification failed',
    };
  }
}

/**
 * Helper function to handle OAuth user creation/update
 */
async function handleOAuthUser(profile: any): Promise<any> {
  try {
    const existingUser = findUserByIdentifier(profile.email);

    if (existingUser) {
      return {
        success: true,
        user: existingUser,
      };
    }

    return {
      success: true,
      user: {
        id: profile.id || `oauth-${Date.now()}`,
        email: profile.email,
        name: profile.name || 'User',
        image: profile.image || '',
        isVerified: false,
        status: 'active',
        onboarding: {
          status: 'pending',
          selectedRole: undefined,
        },
      },
    };
  } catch (error) {
    console.error('Error handling OAuth user:', error);
    return { success: false, message: 'Failed to process OAuth user' };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
      profile: async (profile) => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
      profile: async (profile) => {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url,
        };
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || '',
      clientSecret: process.env.APPLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
      profile: async (profile) => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: '',
        };
      },
    }),
    CredentialsProvider({
      id: 'email-otp',
      name: 'Email OTP',
      credentials: {
        email: { label: 'Email', type: 'email' },
        otp: { label: 'OTP', type: 'text' },
        phone: { label: 'Phone', type: 'text' },
      },
      async authorize(credentials) {
        console.log('Email OTP Authorization:', credentials);

        if (!credentials?.otp) {
          throw new Error('OTP is required');
        }

        try {
          // Verify OTP with backend API
          const otpVerification = await verifyOtpWithBackend(credentials);

          console.log('OTP Verification full response:', otpVerification);

          if (!otpVerification.success) {
            throw new Error(
              otpVerification.message || 'Invalid OTP. Please try again.'
            );
          }

          // ✅ FIX: otpVerification IS the wrapper with { success, data: {...} }
          // So otpVerification.data contains the actual user data
          const userData = otpVerification.data?.data || {};

          console.log("Email verify SATYA 1 - userData extracted:", userData);
          console.log("SATYA 1B - Tokens in userData:", {
            access_token: userData.access_token ? 'SET' : 'EMPTY',
            refresh_token: userData.refresh_token ? 'SET' : 'EMPTY',
            expires_in: userData.expires_in,
          });

          // If no role found, default to 'customer'
          const userRole = userData.role || 'customer' as UserRole;
          const onboardingStatus = 'completed';

          const returnUser = {
            id: userData.user_id || `email-${Date.now()}`,
            email: credentials.email || '',
            name: userData.name || '',
            image: userData.image || '',
            phone: credentials.phone || '',
            role: userRole,
            permissions:
              userData.permissions || rolePermissions[userRole] || [],
            isVerified: userData.email_verified || true,
            status: userData.status || 'active',
            onboarding: {
              status: onboardingStatus as OnboardingStatus,
              selectedRole: userRole,
              completedAt: new Date(),
            },
            isOnboardingCompleted: true,
            // ✅ Access tokens correctly from userData
            accessToken: userData.access_token || '',
            refreshToken: userData.refresh_token || '',
            tokenExpiresIn: userData.expires_in || 3600,
          };

          console.log("SATYA 1C - Return object before sending:", {
            id: returnUser.id,
            email: returnUser.email,
            accessToken: returnUser.accessToken ? 'SET' : 'EMPTY',
            refreshToken: returnUser.refreshToken ? 'SET' : 'EMPTY',
            tokenExpiresIn: returnUser.tokenExpiresIn,
          });

          return returnUser;
        } catch (error: any) {
          console.error('Email OTP authorization error:', error);
          throw new Error(
            error?.message ||
            'Failed to verify OTP. Please try again.'
          );
        }
      },
    }),
    CredentialsProvider({
      id: 'phone-otp',
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        console.log('Phone OTP Authorization:', credentials);

        if (!credentials?.phone || !credentials?.otp) {
          throw new Error('Phone and OTP are required');
        }

        try {
          // Verify OTP with backend API
          const otpVerification = await verifyOtpWithBackend(credentials);

          console.log('OTP Verification Result:', otpVerification);

          if (!otpVerification.success || !otpVerification.data?.verified) {
            throw new Error(
              otpVerification.message || 'Invalid OTP. Please try again.'
            );
          }

          // ✅ Access nested data object
          const userData = otpVerification?.data || {};

          // If no role found, default to 'customer' and mark onboarding as completed
          const userRole = userData.role || ('customer' as UserRole);
          const onboardingStatus = 'completed';

          // Get permissions for the role
          const userPermissions =
            userData.permissions || rolePermissions[userRole] || [];

          return {
            id: userData.user_id || `phone-${Date.now()}`,
            email: userData.email || '',
            name: userData.name || 'User',
            image: userData.image || '',
            phone: credentials.phone,
            role: userRole,
            permissions: userPermissions,
            isVerified: userData.email_verified || true,
            status: userData.status || 'active',
            onboarding: {
              status: onboardingStatus as OnboardingStatus,
              selectedRole: userRole,
              completedAt: new Date(),
            },
            isOnboardingCompleted: true,
            // ✅ Access tokens from userData (nested data)
            accessToken: userData.access_token || '',
            refreshToken: userData.refresh_token || '',
            tokenExpiresIn: userData.expires_in || 3600,
          };
        } catch (error: any) {
          console.error('Phone OTP authorization error:', error);
          throw new Error(
            error?.message ||
            'Failed to verify OTP. Please try again.'
          );
        }
      },
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {


    async session({ session, token }: any) {
      console.log("SATYA 9 - Token:", token);

      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.phone = token.phone;
        session.user.role = token.role || ('customer' as UserRole);
        session.user.permissions = token.permissions || [];
        session.user.isVerified = token.isVerified ?? true;
        session.user.status = token.status || 'active';
        session.user.onboarding = token.onboarding || {
          status: 'completed' as OnboardingStatus,
          selectedRole: token.role || ('customer' as UserRole),
          completedAt: new Date(),
        };

        // Store tokens on session.user (not on session root)
        session.user.accessToken = token.accessToken || '';
        session.user.refreshToken = token.refreshToken || '';
        session.user.tokenExpiresIn = token.tokenExpiresIn || 3600;
        session.user.tokenExpiresAt = token.tokenExpiresAt || Date.now() + (token.tokenExpiresIn || 3600) * 1000;
        session.user.tokenType = token.tokenType || 'Bearer';
        session.user.error = token.error || null;

        // Role-based convenience flags
        session.user.isAdmin = token.role === 'admin';
        session.user.isCaterer = token.role === 'caterer';
        session.user.isCustomer = token.role === 'customer';
        session.user.isModerator = token.role === 'moderator';
        session.user.isSupport = token.role === 'support';
        session.user.isPartner = token.role === 'partner';

        // Onboarding status flags
        session.user.isOnboardingCompleted =
          token.isOnboardingCompleted ||
          token.onboarding?.status === 'completed';
        session.user.isOnboardingPending =
          token.onboarding?.status === 'pending' &&
          !token.isOnboardingCompleted;

        // Permission helper functions
        session.user.hasPermission = (permission: string): boolean => {
          return token.permissions?.includes(permission) ?? false;
        };

        session.user.hasAllPermissions = (permissions: string[]): boolean => {
          return permissions.every((p) => token.permissions?.includes(p));
        };

        session.user.hasAnyPermission = (permissions: string[]): boolean => {
          return permissions.some((p) => token.permissions?.includes(p));
        };
      }

      console.log("SATYA 10 - Session:", session);

      return session;
    },

    async redirect({ url, baseUrl, user }: any) {
      // After OTP verification, redirect to role-specific dashboard
      if (user?.role) {
        return `${baseUrl}/${user.role}/dashboard`;
      }

      // Default redirect for OAuth/other flows
      if (url.includes('callbackUrl')) {
        return url;
      }

      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;

      // Default to customer dashboard
      return `${baseUrl}/customer/dashboard`;
    },


    async jwt({ token, user, account, profile }: any) {
      // Store user data from CredentialsProvider authorize() response
      console.log("SATYA 8 - JWT Input:", {
        userExists: !!user,
        accountProvider: account?.provider,
        tokenHasAccessToken: !!token.accessToken
      });

      if (user) {
        console.log("SATYA 8A - User object received:", {
          id: user.id,
          email: user.email,
          accessToken: user.accessToken ? 'SET' : 'EMPTY',
          refreshToken: user.refreshToken ? 'SET' : 'EMPTY',
          tokenExpiresIn: user.tokenExpiresIn,
        });

        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.phone = user.phone;
        token.role = user.role || ('customer' as UserRole);
        token.permissions = user.permissions || [];
        token.isVerified = user.isVerified ?? true;
        token.status = user.status || 'active';
        token.onboarding = user.onboarding || {
          status: 'completed' as OnboardingStatus,
          selectedRole: user.role || ('customer' as UserRole),
          completedAt: new Date(),
        };

        // ✅ Store tokens from user object
        token.accessToken = user.accessToken || '';
        token.refreshToken = user.refreshToken || '';
        token.tokenExpiresIn = user.tokenExpiresIn || 3600;
        token.tokenExpiresAt = Date.now() + ((user.tokenExpiresIn || 3600) * 1000);
        token.tokenType = user.tokenType || 'Bearer';

        token.isOnboardingCompleted =
          user.isOnboardingCompleted || token.onboarding?.status === 'completed';

        console.log("SATYA 8B - Token after user assignment:", {
          accessToken: token.accessToken ? 'SET' : 'EMPTY',
          refreshToken: token.refreshToken ? 'SET' : 'EMPTY',
          tokenExpiresIn: token.tokenExpiresIn,
          tokenExpiresAt: token.tokenExpiresAt,
        });
      }

      // Token refresh logic
      if (
        token.tokenExpiresAt &&
        Date.now() > (token.tokenExpiresAt as number)
      ) {
        console.log("SATYA 8C - Token expired, attempting refresh");

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/auth/refresh`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refreshToken: token.refreshToken,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("SATYA 8D - Refresh response:", data);

            // ✅ Normalize snake_case from backend to camelCase
            token.accessToken = data.access_token || data.accessToken || token.accessToken;
            token.refreshToken = data.refresh_token || data.refreshToken || token.refreshToken;
            token.tokenExpiresIn = data.expires_in || data.expiresIn || token.tokenExpiresIn;
            token.tokenExpiresAt = Date.now() + ((data.expires_in || data.expiresIn || 3600) * 1000);
          } else {
            console.error("SATYA 8D - Refresh failed:", response.statusText);
            token.error = "RefreshAccessTokenError";
          }
        } catch (error) {
          console.error("SATYA 8D - Error refreshing token:", error);
          token.error = "RefreshAccessTokenError";
        }
      }

      // Handle OAuth provider sign in
      if (account && account.provider !== 'credentials') {
        console.log("SATYA 8E - OAuth login detected:", account.provider);

        try {
          const oauthResult = await handleOAuthUser({
            id: profile?.sub || profile?.id,
            email: token.email,
            name: token.name,
            image: token.picture || profile?.picture?.data?.url,
            provider: account.provider,
          });

          if (oauthResult.success) {
            const oauthUser = oauthResult.user;
            const defaultRole = oauthUser.role || ('customer' as UserRole);

            token.id = oauthUser.id;
            token.role = defaultRole;
            token.permissions =
              oauthUser.permissions ||
              rolePermissions[defaultRole] ||
              [];
            token.isVerified = oauthUser.isVerified ?? false;
            token.status = oauthUser.status;
            token.onboarding = oauthUser.onboarding || {
              status: 'completed' as OnboardingStatus,
              selectedRole: defaultRole,
              completedAt: new Date(),
            };
            token.isOnboardingCompleted = true;

            // ✅ Initialize empty tokens (will be set by provider-specific code below)
            token.accessToken = token.accessToken || '';
            token.refreshToken = token.refreshToken || '';
            token.tokenExpiresIn = token.tokenExpiresIn || 3600;
            token.tokenExpiresAt = token.tokenExpiresAt || Date.now() + 3600 * 1000;
          } else {
            const defaultRole = 'customer' as UserRole;
            token.id = profile?.sub || profile?.id;
            token.role = defaultRole;
            token.permissions = rolePermissions[defaultRole] || [];
            token.isVerified = false;
            token.status = 'active';
            token.accessToken = '';
            token.refreshToken = '';
            token.tokenExpiresIn = 0;
            token.tokenExpiresAt = 0;
            token.onboarding = {
              status: 'completed' as OnboardingStatus,
              selectedRole: defaultRole,
              completedAt: new Date(),
            };
            token.isOnboardingCompleted = true;
          }
        } catch (error) {
          console.error('SATYA 8E - Error handling OAuth user:', error);
          const defaultRole = 'customer' as UserRole;
          token.id = profile?.sub || profile?.id;
          token.role = defaultRole;
          token.permissions = rolePermissions[defaultRole] || [];
          token.isVerified = false;
          token.status = 'active';
          token.accessToken = '';
          token.refreshToken = '';
          token.tokenExpiresIn = 0;
          token.tokenExpiresAt = 0;
          token.onboarding = {
            status: 'completed' as OnboardingStatus,
            selectedRole: defaultRole,
            completedAt: new Date(),
          };
          token.isOnboardingCompleted = true;
        }
      }

      // Google social login - overrides OAuth data above
      if (account?.provider === "google") {
        console.log("SATYA 8F - Google social login detected");

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/social-login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: token.email,
                name: token.name,
                image: token.picture,
                provider: "google",
                token: account.id_token,
              }),
            }
          );

          if (!res.ok) {
            console.error("SATYA 8F - Social login failed:", res.statusText);
            return token;
          }

          const response = await res.json();
          console.log("SATYA 8F - Google login response:", response);

          // ✅ Access nested data correctly
          const data = response.data || response;

          token.id = data.user_id || token.id;
          token.role = data.role || 'customer';
          token.status = data.status || 'active';
          token.isVerified = data.email_verified ?? false;
          token.permissions = rolePermissions[data.role || 'customer'] || [];

          token.onboarding = {
            status: (data.onboarding_status || 'pending') as OnboardingStatus,
            selectedRole: data.role || 'customer',
            completedAt: data.onboarding_status === 'completed' ? new Date() : undefined,
          };
          token.isOnboardingCompleted = data.onboarding_status === 'completed';
          token.isNewUser = data.is_new_user ?? false;
          token.emailVerified = data.email_verified ?? false;
          token.phoneVerified = data.phone_verified ?? false;

          // ✅ Normalize snake_case to camelCase
          token.accessToken = data.access_token || '';
          token.refreshToken = data.refresh_token || '';
          token.tokenType = data.token_type || 'Bearer';
          token.tokenExpiresIn = data.expires_in || 900;
          token.tokenExpiresAt = Date.now() + ((data.expires_in || 900) * 1000);

          console.log("SATYA 8F - Token after Google login:", {
            accessToken: token.accessToken ? 'SET' : 'EMPTY',
            refreshToken: token.refreshToken ? 'SET' : 'EMPTY',
            tokenExpiresIn: token.tokenExpiresIn,
            tokenExpiresAt: token.tokenExpiresAt,
          });
        }
        catch (error) {
          console.error("SATYA 8F - Error during Google social login:", error);
          token.error = "GoogleLoginError";
        }
      }

      console.log("SATYA 8Z - Final token before return:", {
        hasId: !!token.id,
        hasEmail: !!token.email,
        hasAccessToken: !!token.accessToken,
        hasRefreshToken: !!token.refreshToken,
        tokenExpiresIn: token.tokenExpiresIn,
        tokenExpiresAt: token.tokenExpiresAt,
      });

      return token;
    }

  },

  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
};

export { mockUsers, rolePermissions };