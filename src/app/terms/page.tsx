// ═══════════════════════════════════════════════════════════════════════════════
// AscendifyIFY - Terms of Service Page
// ═══════════════════════════════════════════════════════════════════════════════

import { Mountain, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Ascendify',
  description: 'Ascendify Terms of Service - Rules and guidelines for using our app.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ascend-500 to-ascend-600 
                          flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">ASCENDIFY</span>
            <span className="text-white/50 group-hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-white/50 mb-8">Last updated: January 3, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">1. Acceptance of Terms</h2>
            <p className="text-white/70 leading-relaxed">
              By accessing and using Ascendify (&quot;the App&quot;), you accept and agree to be bound by these 
              Terms of Service. If you do not agree to these terms, please do not use the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">2. Description of Service</h2>
            <p className="text-white/70 leading-relaxed">
              Ascendify is a habit tracking and goal achievement application that helps users build 
              better habits through AI-powered goal decomposition, gamification, and progress tracking. 
              The App is provided on a freemium basis with optional paid features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">3. User Accounts</h2>
            <p className="text-white/70 leading-relaxed mb-4">To use certain features, you must:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">4. Subscription & Payment</h2>
            <div className="text-white/70 leading-relaxed space-y-4">
              <p><strong className="text-white">Free Plan:</strong> Access to basic features with limitations on number of habits and goals.</p>
              <p><strong className="text-white">Pro Plan ($9/month):</strong> Full access to all features, billed monthly. Cancel anytime.</p>
              <p><strong className="text-white">Lifetime Plan ($149 one-time):</strong> Perpetual access to all current and future features.</p>
              <p>All payments are processed securely. Refunds are available within 14 days of purchase for Pro subscriptions and within 30 days for Lifetime purchases if you haven&apos;t extensively used premium features.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">5. Acceptable Use</h2>
            <p className="text-white/70 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Use the App for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the App&apos;s functionality</li>
              <li>Reverse engineer, decompile, or modify the App</li>
              <li>Use automated systems or bots to access the App</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">6. Intellectual Property</h2>
            <p className="text-white/70 leading-relaxed">
              Ascendify, including its logo, design, features, and content, is protected by copyright, 
              trademark, and other intellectual property laws. You may not copy, modify, distribute, 
              or create derivative works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">7. User Content</h2>
            <p className="text-white/70 leading-relaxed">
              You retain ownership of any content you create within the App (goals, habits, notes). 
              You grant us a limited license to process this content solely to provide our services. 
              We do not claim ownership of your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-white/70 leading-relaxed">
              Ascendify is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that 
              the App will be error-free, uninterrupted, or meet your specific requirements. Use of 
              the App is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">9. Limitation of Liability</h2>
            <p className="text-white/70 leading-relaxed">
              To the maximum extent permitted by law, Ascendify shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising from your use of the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">10. Changes to Terms</h2>
            <p className="text-white/70 leading-relaxed">
              We may update these Terms from time to time. We will notify users of significant changes. 
              Continued use of the App after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">11. Termination</h2>
            <p className="text-white/70 leading-relaxed">
              We reserve the right to suspend or terminate your account for violations of these Terms. 
              You may delete your account at any time through the App settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">12. Contact</h2>
            <p className="text-white/70 leading-relaxed">
              For questions about these Terms, contact us at:
              <br />
              <a href="mailto:legal@ascendify.app" className="text-ascend-400 hover:underline">
                legal@ascendify.app
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center text-white/40 text-sm">
          © 2026 Ascendify. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
