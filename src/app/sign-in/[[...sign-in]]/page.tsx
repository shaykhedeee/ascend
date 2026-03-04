import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <section className="w-full max-w-md border border-zinc-900 bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">AUTH_TERMINAL :: SIGN_IN</span>
          </div>
          <Link href="/" className="font-mono text-xs tracking-widest text-zinc-400 transition-colors hover:text-zinc-300">
            [← HOME]
          </Link>
        </div>
        <div className="p-4 md:p-6">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: '#EA580C',
              colorBackground: '#09090B',
              colorInputBackground: '#000000',
              colorInputText: '#FAFAF9',
              colorText: '#FAFAF9',
              colorTextSecondary: '#71717A',
              borderRadius: '0px',
            },
            elements: {
              card: 'shadow-none bg-transparent border-0 p-0',
              headerTitle: 'font-mono text-zinc-100',
              headerSubtitle: 'font-mono text-zinc-500',
              socialButtonsBlockButton:
                'border border-zinc-800 bg-black hover:bg-zinc-950 text-zinc-300 font-mono',
              formButtonPrimary:
                'bg-orange-700 hover:bg-orange-600 text-white font-mono',
              formFieldInput:
                'border border-zinc-800 bg-black text-zinc-200 font-mono',
              footerActionLink: 'text-orange-500 hover:text-orange-400 font-mono',
              identityPreviewText: 'font-mono text-zinc-400',
            },
          }}
        />
        {/* Help note — shown for the breach-password error Clerk surfaces */}
        <p className="mt-4 font-mono text-[0.7rem] leading-relaxed tracking-wide text-zinc-600 border-t border-zinc-900 pt-3">
          <span className="text-zinc-500">PASSWORD_BREACH_ERROR?</span>{' '}
          If you see &ldquo;password found in a breach&rdquo;, use the{' '}
          <span className="text-orange-600">Forgot password?</span> link above to reset it,
          or choose a unique password that is not commonly used.
        </p>
        </div>
      </section>
    </main>
  );
}
