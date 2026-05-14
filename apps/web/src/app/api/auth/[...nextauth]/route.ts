import { authOptions } from '@catering-marketplace/auth';
import NextAuth from 'next-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

console.log('AUTH CHECK', {
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasAuthSecret: !!process.env.AUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL,
});

console.log("All envs,", process.env);


const handler = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };