import { redirect } from 'next/navigation';

// Redirect /login to home — Clerk handles sign-in via <SignInButton> modal
export const GET = async () => {
  return redirect('/');
};
