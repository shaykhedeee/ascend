import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-ascend-500/15 blur-3xl" />
        <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
      </div>

      <section className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 p-4 shadow-2xl backdrop-blur md:p-6">
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Create your account</h1>
          <Link href="/" className="text-sm text-ascend-400 hover:text-ascend-300">
            ← Home
          </Link>
        </div>

        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: '#F97316',
              colorBackground: '#171412',
              colorInputBackground: '#1C1917',
              colorInputText: '#FAFAF9',
              colorText: '#FAFAF9',
              colorTextSecondary: '#A8A29E',
              borderRadius: '0.75rem',
            },
            elements: {
              card: 'shadow-none bg-transparent border-0 p-0',
              headerTitle: 'text-[var(--text-primary)]',
              headerSubtitle: 'text-[var(--text-secondary)]',
              socialButtonsBlockButton:
                'border border-[var(--border)] bg-[var(--background-secondary)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)]',
              formButtonPrimary:
                'bg-gradient-to-r from-ascend-500 to-ascend-600 hover:from-ascend-400 hover:to-ascend-500 text-white',
              formFieldInput:
                'border border-[var(--border)] bg-[var(--background-secondary)] text-[var(--text-primary)]',
              footerActionLink: 'text-ascend-400 hover:text-ascend-300',
              identityPreviewText: 'text-[var(--text-secondary)]',
            },
          }}
        />
      </section>
    </main>
  );
}
