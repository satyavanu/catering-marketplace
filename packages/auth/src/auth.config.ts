import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import type { NextAuthOptions, User as NextAuthUser } from 'next-auth';

export type PartnerSessionProfile = {
  id: string;
  userId: string;
  contactName?: string;
  businessName?: string | null;
  businessDescription?: string | null;
  kitchenAddress?: string | null;
  baseCityId?: string | null;
  capacityRangeId?: string | null;
  onboardingId?: string | null;
  status?: string;
  countryCode?: string;
  timezone?: string;
  rating?: number | null;
  totalReviews?: number;
  createdAt?: string;
  updatedAt?: string;
};

declare module 'next-auth' {
  interface User {
    permissions?: string[];
    refreshToken?: string;
    accessToken?: string;
    fullName?: string;
    referralCode?: string;
    tokenExpiresIn?: number;
    tokenExpiresAt?: number;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    isOnboardingCompleted?: boolean;
    isPartner?: boolean;
    partner?: PartnerSessionProfile | null;
  }

  interface CustomUser extends NextAuthUser {
    permissions?: string[];
    refreshToken?: string;
    accessToken?: string;
    fullName?: string;
    referralCode?: string;
    tokenExpiresIn?: number;
    tokenExpiresAt?: number;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    isOnboardingCompleted?: boolean;
    isPartner?: boolean;
    partner?: PartnerSessionProfile | null;
  }
}
import { verifyOtpApi } from '../../query-client/src';

// Role types
export type UserRole =
  | 'customer'
  | 'caterer'
  | 'admin'
  | 'super_admin'
  | 'moderator'
  | 'support'
  | 'partner';
export type OnboardingStatus = 'pending' | 'in_progress' | 'completed';

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
  super_admin: [
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

function normalizeUserRole(role: unknown): UserRole {
  const allowedRoles: UserRole[] = [
    'customer',
    'caterer',
    'admin',
    'super_admin',
    'moderator',
    'support',
    'partner',
  ];

  return allowedRoles.includes(role as UserRole)
    ? (role as UserRole)
    : 'customer';
}

function getAccountHomePath(role: unknown): string {
  const normalizedRole = normalizeUserRole(role);
  if (normalizedRole === 'customer') return '/customer';
  if (normalizedRole === 'admin' || normalizedRole === 'super_admin') {
    return '/admin';
  }
  return '/partner';
}

function isAdminRole(role: unknown): boolean {
  return role === 'admin' || role === 'super_admin';
}

function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.BACKEND_URL ||
    'http://localhost:8080'
  );
}

async function fetchMyPartnerProfile(
  accessToken?: unknown
): Promise<PartnerSessionProfile | null> {
  if (!accessToken || typeof accessToken !== 'string') {
    return null;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/v1/partners/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 404 || response.status === 401) {
      return null;
    }

    if (!response.ok) {
      console.error('Failed to fetch partner profile:', response.statusText);
      return null;
    }

    const payload = await response.json();
    return payload?.data || null;
  } catch (error) {
    console.error('Error fetching partner profile:', error);
    return null;
  }
}

async function applyPartnerRoleFromProfile(token: any): Promise<any> {
  const currentRole = normalizeUserRole(token.role);

  if (isAdminRole(currentRole)) {
    token.role = currentRole;
    token.isPartner = false;
    token.partner = null;
    token.permissions = rolePermissions[currentRole] || [];
    return token;
  }

  const partner = await fetchMyPartnerProfile(token.accessToken);

  if (partner?.id) {
    token.role = 'partner';
    token.isPartner = true;
    token.partner = partner;
    token.permissions = rolePermissions.partner;
    return token;
  }

  token.role = 'customer';
  token.isPartner = false;
  token.partner = null;
  token.permissions = rolePermissions.customer;
  return token;
}

async function verifyOtpWithBackend(credentials: any): Promise<any> {
  try {
    if (!credentials.otp || credentials?.otp?.length < 6) {
      return { success: false, verified: false, message: 'OTP is required' };
    }
    const result = await verifyOtpApi(credentials);
    return result;
  } catch (error) {
    return {
      success: false,
      verified: false,
      message: 'OTP verification failed',
    };
  }
}

async function authorizeOtpUser(
  credentials: any,
  otpType: 'email' | 'phone'
): Promise<NextAuthUser | null> {
  console.log(`${otpType.toUpperCase()} OTP Authorization:`, credentials);

  if (!credentials?.otp) {
    throw new Error('OTP is required');
  }

  if (otpType === 'phone' && !credentials?.phone) {
    throw new Error('Phone number is required');
  }

  try {
    const otpVerification = await verifyOtpWithBackend(credentials);

    console.log(`OTP Verification Result (${otpType}):`, otpVerification);

    if (!otpVerification.success) {
      throw new Error(
        otpVerification.message || 'Invalid OTP. Please try again.'
      );
    }

    const userData = otpVerification.data?.data || {};
    const userRole = normalizeUserRole(userData.role);
    const onboardingStatus = userData.onboarding_status || 'pending';
    const fullName =
      userData.full_name || userData.name || credentials.full_name || '';

    const returnUser = {
      id: userData.user_id || `${otpType}-${Date.now()}`,
      email: userData.email || credentials.email || '',
      name: fullName,
      fullName,
      image: userData.image || '',
      phone: credentials.phone || userData.phone || '',
      referralCode: userData.referral_code || '',
      role: userRole,
      permissions: userData.permissions || rolePermissions[userRole] || [],
      isVerified:
        otpType === 'email'
          ? userData.email_verified || true
          : userData.phone_verified || false,
      status: userData.status || 'active',
      onboarding: {
        status: onboardingStatus as OnboardingStatus,
        selectedRole: userRole,
        completedAt: onboardingStatus === 'completed' ? new Date() : undefined,
      },
      isOnboardingCompleted: onboardingStatus === 'completed',
      accessToken: userData.access_token || '',
      refreshToken: userData.refresh_token || '',
      tokenExpiresIn: userData.expires_in || 900,
      tokenType: userData.token_type || 'Bearer',
      termsAccepted: userData.terms_accepted ?? false,
      privacyAccepted: userData.privacy_accepted ?? false,
      marketingEmail: userData.marketing_email ?? false,
      marketingSms: userData.marketing_sms ?? false,
      marketingPush: userData.marketing_push ?? false,
      marketingWhatsapp: userData.marketing_whatsapp ?? false,
      consentsProvided: userData.consents_provided ?? false,
    };
    return returnUser;
  } catch (error: any) {
    throw new Error(
      error?.message || 'Failed to verify OTP. Please try again.'
    );
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
    CredentialsProvider({
      id: 'email-otp',
      name: 'Email OTP',
      credentials: {
        email: { label: 'Email', type: 'email' },
        otp: { label: 'OTP', type: 'text' },
        phone: { label: 'Phone', type: 'text' },
        intent: { label: 'Intent', type: 'text' },
        full_name: { label: 'Full name', type: 'text' },
        referral_code: { label: 'Referral code', type: 'text' },
      },
      async authorize(credentials) {
        return await authorizeOtpUser(credentials, 'email');
      },
    }),
    CredentialsProvider({
      id: 'phone-otp',
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
        intent: { label: 'Intent', type: 'text' },
        full_name: { label: 'Full name', type: 'text' },
        referral_code: { label: 'Referral code', type: 'text' },
      },
      async authorize(credentials) {
        return await authorizeOtpUser(credentials, 'phone');
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.fullName = token.fullName || token.name;
        session.user.image = token.image;
        session.user.phone = token.phone;
        session.user.referralCode = token.referralCode || '';
        session.user.role = token.role || ('customer' as UserRole);
        session.user.permissions = token.permissions || [];
        session.user.partner = token.partner || null;
        session.user.isVerified = token.isVerified ?? true;
        session.user.status = token.status || 'active';
        session.user.onboarding = token.onboarding || {
          status: 'completed' as OnboardingStatus,
          selectedRole: token.role || ('customer' as UserRole),
          completedAt: new Date(),
        };

        session.user.accessToken = token.accessToken || '';
        session.user.refreshToken = token.refreshToken || '';
        session.user.tokenExpiresIn = token.tokenExpiresIn || 3600;
        session.user.tokenExpiresAt =
          token.tokenExpiresAt ||
          Date.now() + (token.tokenExpiresIn || 3600) * 1000;
        session.user.tokenType = token.tokenType || 'Bearer';
        session.user.error = token.error || null;

        session.user.termsAccepted = token.termsAccepted ?? false;
        session.user.privacyAccepted = token.privacyAccepted ?? false;
        session.user.marketingEmail = token.marketingEmail ?? false;
        session.user.marketingSms = token.marketingSms ?? false;
        session.user.marketingPush = token.marketingPush ?? false;
        session.user.marketingWhatsapp = token.marketingWhatsapp ?? false;
        session.user.consentsProvided = token.consentsProvided ?? false;

        session.user.isAdmin = token.role === 'admin';
        session.user.isCaterer = token.role === 'caterer';
        session.user.isCustomer = token.role === 'customer';
        session.user.isModerator = token.role === 'moderator';
        session.user.isSupport = token.role === 'support';
        session.user.isPartner = Boolean(token.isPartner);

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

      return session;
    },

    async redirect({ url, baseUrl, user }: any) {
      if (url === baseUrl || url === '/' || url === `${baseUrl}/`) {
        return baseUrl;
      }

      return `${baseUrl}${getAccountHomePath(user?.role)}`;
    },

    async jwt({ token, user, account, profile }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || user.fullName;
        token.fullName = user.fullName || user.name;
        token.image = user.image;
        token.phone = user.phone;
        token.referralCode = user.referralCode || '';
        token.role = user.role || ('customer' as UserRole);
        token.permissions = user.permissions || [];
        token.partner = user.partner || null;
        token.isPartner = user.isPartner || false;
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
        token.tokenExpiresAt =
          Date.now() + (user.tokenExpiresIn || 3600) * 1000;
        token.tokenType = user.tokenType || 'Bearer';

        token.termsAccepted = user.termsAccepted ?? false;
        token.privacyAccepted = user.privacyAccepted ?? false;
        token.marketingEmail = user.marketingEmail ?? false;
        token.marketingSms = user.marketingSms ?? false;
        token.marketingPush = user.marketingPush ?? false;
        token.marketingWhatsapp = user.marketingWhatsapp ?? false;
        token.consentsProvided = user.consentsProvided ?? false;

        token.isOnboardingCompleted =
          user.isOnboardingCompleted ||
          token.onboarding?.status === 'completed';
      }

      if (
        token.tokenExpiresAt &&
        Date.now() > (token.tokenExpiresAt as number)
      ) {
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/auth/refresh`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                refreshToken: token.refreshToken,
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();

            // ✅ Normalize snake_case from backend to camelCase
            token.accessToken =
              data.access_token || data.accessToken || token.accessToken;
            token.refreshToken =
              data.refresh_token || data.refreshToken || token.refreshToken;
            token.tokenExpiresIn =
              data.expires_in || data.expiresIn || token.tokenExpiresIn;
            token.tokenExpiresAt =
              Date.now() + (data.expires_in || data.expiresIn || 3600) * 1000;
          } else {
            console.error('SATYA 8D - Refresh failed:', response.statusText);
            token.error = 'RefreshAccessTokenError';
          }
        } catch (error) {
          console.error('SATYA 8D - Error refreshing token:', error);
          token.error = 'RefreshAccessTokenError';
        }
      }

      // Google social login - overrides OAuth data above
      if (account?.provider === 'google') {
        console.log('SATYA 8F - Google social login detected');

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/social-login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: token.email,
                name: token.name,
                image: token.picture,
                provider: 'google',
                token: account.id_token,
              }),
            }
          );

          if (!res.ok) {
            return token;
          }

          const response = await res.json();
          const data = response.data || response;
          token.id = data.user_id || token.id;
          token.name = data.full_name || data.name || token.name;
          token.fullName = data.full_name || data.name || token.fullName;
          const backendRole = normalizeUserRole(data.role);
          token.role = backendRole;
          token.status = data.status || 'active';
          token.referralCode = data.referral_code || '';
          token.isVerified = data.email_verified ?? false;
          token.permissions = rolePermissions[backendRole] || [];

          token.onboarding = {
            status: (data.onboarding_status || 'pending') as OnboardingStatus,
            selectedRole: backendRole,
            completedAt:
              data.onboarding_status === 'completed' ? new Date() : undefined,
          };
          token.isOnboardingCompleted = data.onboarding_status === 'completed';
          token.isNewUser = data.is_new_user ?? false;
          token.emailVerified = data.email_verified ?? false;
          token.phoneVerified = data.phone_verified ?? false;

          token.accessToken = data.access_token || '';
          token.refreshToken = data.refresh_token || '';
          token.tokenType = data.token_type || 'Bearer';
          token.tokenExpiresIn = data.expires_in || 900;
          token.tokenExpiresAt = Date.now() + (data.expires_in || 900) * 1000;

          token.termsAccepted = data.terms_accepted ?? false;
          token.privacyAccepted = data.privacy_accepted ?? false;
          token.marketingEmail = data.marketing_email ?? false;
          token.marketingSms = data.marketing_sms ?? false;
          token.marketingPush = data.marketing_push ?? false;
          token.marketingWhatsapp = data.marketing_whatsapp ?? false;
          token.consentsProvided = data.consents_provided ?? false;
        } catch (error) {
          token.error = 'GoogleLoginError';
        }
      }
      return applyPartnerRoleFromProfile(token);
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

export { rolePermissions };
