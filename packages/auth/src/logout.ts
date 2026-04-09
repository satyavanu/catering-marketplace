import { signOut, getSession } from "next-auth/react";
import { logoutApi } from '../../query-client/src';

export async function handleLogout() {
  try {
    const session = await getSession();

    if (!session?.user?.accessToken) {
      console.warn('No backend access token found in session');
    } else {
      const response = await logoutApi({
        accessToken: session.user.accessToken,
      });

      if (response.success) {
        console.log('Backend logout successful:', response.message);
      } else {
        console.error('Backend logout failed:', response.error);
      }
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    await signOut({ callbackUrl: '/' });
  }
}