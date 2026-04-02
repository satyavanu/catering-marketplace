import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import type { NextAuthOptions } from 'next-auth';
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
async function verifyOtpWithBackend(
 credentials): Promise<any> {
  try {
    if (!credentials.otp) {
      return { success: false, verified: false, message: 'OTP is required' };
    }

    const result = await verifyOtpApi(credentials);

    return result;
  } catch (error) {
    console.error('Error verifying OTP with backend:', error);
    return { success: false, verified: false, message: 'OTP verification failed' };
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
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
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

        console.log('SATYA 1', credentials);
        if (!credentials?.otp) {
          throw new Error(' OTP is required');
        }

        try {
          // Verify OTP with backend API
          const otpVerification = await verifyOtpWithBackend(
          credentials
          );

          console.log("SATYa", otpVerification);

          if (!otpVerification.success ) {
            throw new Error(otpVerification.message || 'Invalid OTP');
          }

       const  user = otpVerification?.data || {};

          return {
            id: user.user_id,
            email: credentials.email || '',
            name: user.name || '',
            image: user.image || '',
            phone: credentials.phone || '',
            role: user.role || null,
            permissions: user.permissions || [],
            isVerified: user.isVerified   || false,
            status: user.status   || 'active',
            onboarding: {
              status:  user.onboarding?.status || 'pending',
              selectedRole: undefined,
            },
          };
        } catch (error) {
          console.error('Email OTP authorization error:', error);
          throw error;
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
        if (!credentials?.phone || !credentials?.otp) {
          throw new Error('Phone and OTP are required');
        }

        try {
          // Verify OTP with backend API
          const otpVerification = await verifyOtpWithBackend(
          
           credentials);

          if (!otpVerification.success || !otpVerification.data?.verified) {
            throw new Error(otpVerification.message || 'Invalid OTP');
          }

          // Fetch user data from backend
          const userResponse = await fetchUserByIdentifier(credentials.phone);

          if (!userResponse.success) {
            throw new Error(userResponse.message || 'User not found');
          }

          const user = userResponse.user;

          // Check user account status
          if (user.status !== 'active') {
            throw new Error(`User account is ${user.status}`);
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role || null,
            permissions: user.permissions || [],
            isVerified: user.isVerified,
            status: user.status,
            onboarding: user.onboarding || {
              status: 'pending',
              selectedRole: undefined,
            },
          };
        } catch (error) {
          console.error('Phone OTP authorization error:', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account, profile }: any) {
      // Store user data from CredentialsProvider authorize() response
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role || null;
        token.permissions = user.permissions || [];
        token.isVerified = user.isVerified ?? false;
        token.status = user.status || 'active';
        token.onboarding = user.onboarding || {
          status: 'pending',
          selectedRole: undefined,
        };
      }

      // Handle OAuth provider sign in
      if (account && account.provider !== 'credentials') {
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
            token.id = oauthUser.id;
            token.role = oauthUser.role || null;
            token.permissions = oauthUser.permissions || [];
            token.isVerified = oauthUser.isVerified;
            token.status = oauthUser.status;
            token.onboarding = oauthUser.onboarding;
          } else {
            token.id = profile?.sub || profile?.id;
            token.role = null;
            token.permissions = [];
            token.isVerified = false;
            token.status = 'active';
            token.onboarding = {
              status: 'pending',
              selectedRole: undefined,
            };
          }
        } catch (error) {
          console.error('Error handling OAuth user:', error);
          token.id = profile?.sub || profile?.id;
          token.role = null;
          token.permissions = [];
          token.isVerified = false;
          token.status = 'active';
          token.onboarding = {
            status: 'pending',
            selectedRole: undefined,
          };
        }
      }

      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.isVerified = token.isVerified;
        session.user.status = token.status;
        session.user.onboarding = token.onboarding;

        // Role-based convenience flags
        session.user.isAdmin = token.role === 'admin';
        session.user.isCaterer = token.role === 'caterer';
        session.user.isCustomer = token.role === 'customer';
        session.user.isModerator = token.role === 'moderator';
        session.user.isSupport = token.role === 'support';
        session.user.isPartner = token.role === 'partner';

        // Onboarding status flags
        session.user.isOnboardingCompleted = token.onboarding?.status === 'completed';
        session.user.isOnboardingPending = token.onboarding?.status === 'pending' || !token.role;

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

      return session;
    },

    async redirect({ url, baseUrl }: any) {
      if (url.includes('callbackUrl')) {
        return url;
      }

      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
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