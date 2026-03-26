import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import type { NextAuthOptions } from 'next-auth';

// Role types
export type UserRole = 'customer' | 'caterer' | 'admin' | 'moderator' | 'support' | 'partner';

// Mock database of users with roles
const mockUsers: Record<
  string,
  {
    id: string;
    email: string;
    name: string;
    image: string;
    role: UserRole;
    permissions?: string[];
    isVerified: boolean;
    status: 'active' | 'inactive' | 'suspended';
  }
> = {
  'demo@example.com': {
    id: '1',
    email: 'demo@example.com',
    name: 'John Doe',
    image: 'https://i.pravatar.cc/150?img=1',
    role: 'customer',
    isVerified: true,
    status: 'active',
    permissions: ['read:events', 'create:orders', 'read:profile'],
  },
  'caterer@example.com': {
    id: '2',
    email: 'caterer@example.com',
    name: 'Chef Maria',
    image: 'https://i.pravatar.cc/150?img=2',
    role: 'caterer',
    isVerified: true,
    status: 'active',
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
    name: 'Admin User',
    image: 'https://i.pravatar.cc/150?img=3',
    role: 'admin',
    isVerified: true,
    status: 'active',
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
    name: 'Sarah Moderator',
    image: 'https://i.pravatar.cc/150?img=4',
    role: 'moderator',
    isVerified: true,
    status: 'active',
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
    name: 'Support Team',
    image: 'https://i.pravatar.cc/150?img=5',
    role: 'support',
    isVerified: true,
    status: 'active',
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
    name: 'Partner Corp',
    image: 'https://i.pravatar.cc/150?img=6',
    role: 'partner',
    isVerified: true,
    status: 'active',
    permissions: [
      'read:events',
      'create:events',
      'read:analytics',
      'manage:partnership',
      'read:reports',
    ],
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

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Check mock users database
        const mockUser = mockUsers[credentials?.email || ''];

        if (
          mockUser &&
          credentials?.password === 'password' &&
          mockUser.status === 'active'
        ) {
          return {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
            image: mockUser.image,
            role: mockUser.role,
            permissions: mockUser.permissions,
            isVerified: mockUser.isVerified,
            status: mockUser.status,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role || 'customer';
        token.permissions = user.permissions || rolePermissions[user.role || 'customer'];
        token.isVerified = user.isVerified ?? true;
        token.status = user.status || 'active';
      }

      // OAuth provider sign in
      if (account && account.provider !== 'credentials') {
        const email = token.email || '';
        const existingUser = mockUsers[email];

        if (!existingUser) {
          // Default role for new OAuth users
          token.role = 'customer';
          token.permissions = rolePermissions.customer;
          token.isVerified = true;
          token.status = 'active';
        } else {
          token.role = existingUser.role;
          token.permissions = existingUser.permissions;
          token.isVerified = existingUser.isVerified;
          token.status = existingUser.status;
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

        // Add role-based properties for convenience
        session.user.isAdmin = token.role === 'admin';
        session.user.isCaterer = token.role === 'caterer';
        session.user.isCustomer = token.role === 'customer';
        session.user.isModerator = token.role === 'moderator';
        session.user.isSupport = token.role === 'support';
        session.user.isPartner = token.role === 'partner';

        // Helper function to check permissions
        session.user.hasPermission = (permission: string): boolean => {
          return token.permissions?.includes(permission) ?? false;
        };

        // Helper function to check multiple permissions (AND logic)
        session.user.hasAllPermissions = (permissions: string[]): boolean => {
          return permissions.every((p) => token.permissions?.includes(p));
        };

        // Helper function to check multiple permissions (OR logic)
        session.user.hasAnyPermission = (permissions: string[]): boolean => {
          return permissions.some((p) => token.permissions?.includes(p));
        };
      }

      return session;
    },

    async redirect({ url, baseUrl }: any) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
  },

  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
};

export { mockUsers, rolePermissions };
