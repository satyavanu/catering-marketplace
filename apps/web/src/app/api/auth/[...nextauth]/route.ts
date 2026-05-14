import { authOptions } from '@catering-marketplace/auth';
import NextAuth from 'next-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };