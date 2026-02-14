// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Privacy Policy Page
// ═══════════════════════════════════════════════════════════════════════════════

import { Mountain, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | ASCEND',
  description: 'ASCEND Privacy Policy - How we protect your data and respect your privacy.',
};

export default function PrivacyPolicy() {
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
            <span className="font-bold text-lg">ASCEND</span>
            <span className="text-white/50 group-hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/50 mb-8">Last updated: January 3, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">1. Our Commitment to Privacy</h2>
            <p className="text-white/70 leading-relaxed">
              ASCEND is designed with your privacy as a core principle. We believe your personal data 
              belongs to you, and we&apos;ve built our app to minimize data collection while maximizing 
              your ability to achieve your goals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">2. Data Storage</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              <strong className="text-white">Local-First Approach:</strong> ASCEND stores your data 
              locally on your device using browser storage technology. This means:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Your habits, goals, and progress data never leave your device by default</li>
              <li>You have complete control over your data</li>
              <li>You can export or delete your data at any time</li>
              <li>No server-side storage of personal information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">3. Information We Collect</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              We collect minimal information to provide our services:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li><strong className="text-white">Account Information:</strong> Name and email address for account creation</li>
              <li><strong className="text-white">Usage Analytics:</strong> Anonymous, aggregated data about app usage to improve features</li>
              <li><strong className="text-white">Payment Information:</strong> For Pro/Lifetime subscriptions, processed securely by our payment provider</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">4. AI Goal Decomposition</h2>
            <p className="text-white/70 leading-relaxed">
              When you use our AI Goal Decomposition feature, your goal text is processed to generate 
              personalized milestones and tasks. This processing happens in real-time and we do not 
              store your goal descriptions on our servers after processing is complete.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">5. Data Sharing</h2>
            <p className="text-white/70 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              anonymous, aggregated statistics to improve our services or for research purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">6. Your Rights</h2>
            <p className="text-white/70 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Access all data we have about you</li>
              <li>Export your data in JSON format</li>
              <li>Delete your account and all associated data</li>
              <li>Opt out of analytics collection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">7. Cookies</h2>
            <p className="text-white/70 leading-relaxed">
              ASCEND uses essential cookies only for maintaining your session and preferences. 
              We do not use tracking cookies or third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">8. Security</h2>
            <p className="text-white/70 leading-relaxed">
              We implement industry-standard security measures to protect your information. 
              All data transmission is encrypted using HTTPS. Your local data is stored securely 
              in your browser&apos;s protected storage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-white/70 leading-relaxed">
              ASCEND is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-ascend-400 mb-4">10. Contact Us</h2>
            <p className="text-white/70 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:privacy@ascend.app" className="text-ascend-400 hover:underline">
                privacy@ascend.app
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center text-white/40 text-sm">
          © 2026 ASCEND. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
