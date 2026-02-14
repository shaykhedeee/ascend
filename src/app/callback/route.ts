import { redirect } from 'next/navigation';

// Clerk handles auth callbacks internally — redirect to home
export const GET = async () => {
  return redirect('/');
};
