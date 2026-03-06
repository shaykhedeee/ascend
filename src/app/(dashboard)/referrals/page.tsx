'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Referral Dashboard
// Share your code, track referrals, earn rewards
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useStoreUser } from '@/hooks/useStoreUser';
import { useState, useEffect } from 'react';
import {
  Users,
  Gift,
  Copy,
  Check,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  MessageCircle,
  Trophy,
  Coins,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReferralsPage() {
  const { user } = useStoreUser();
  const referrals = useQuery(api.referrals.getMyReferrals, user ? {} : 'skip');
  const shareData = useQuery(api.referrals.getReferralShareData, user ? {} : 'skip');
  const ensureCode = useMutation(api.referrals.ensureReferralCode);

  const [copied, setCopied] = useState(false);
  const [codeReady, setCodeReady] = useState(false);

  // Ensure user has a referral code
  useEffect(() => {
    if (user && !referrals?.code) {
      ensureCode({}).then(() => setCodeReady(true)).catch(() => {});
    } else if (referrals?.code) {
      setCodeReady(true);
    }
  }, [user, referrals?.code, ensureCode]);

  const handleCopy = async () => {
    if (!shareData?.url) return;
    await navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    if (!shareData) return;
    const { text, url } = shareData;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=RESURGO,habits,productivity`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`,
    };
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Gift className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h1 className="font-mono text-lg font-bold tracking-wider text-zinc-100">
                REFERRAL_PROGRAM
              </h1>
              <p className="font-mono text-xs text-zinc-500">
                Invite friends. Earn 200 XP + 100 coins per referral.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: 'Total Invited', value: referrals?.total ?? 0, icon: Users, color: 'text-blue-400' },
            { label: 'Completed', value: referrals?.completed ?? 0, icon: Check, color: 'text-green-400' },
            { label: 'XP Earned', value: shareData?.xpEarned ?? 0, icon: Zap, color: 'text-yellow-400' },
            { label: 'Coins Earned', value: shareData?.coinsEarned ?? 0, icon: Coins, color: 'text-orange-400' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-zinc-900 bg-zinc-950 p-4"
            >
              <stat.icon className={cn('mb-2 h-4 w-4', stat.color)} />
              <p className="font-mono text-2xl font-bold text-zinc-100">
                {stat.value.toLocaleString()}
              </p>
              <p className="font-mono text-[9px] tracking-widest text-zinc-500">
                {stat.label.toUpperCase()}
              </p>
            </div>
          ))}
        </div>

        {/* Referral Code Card */}
        <div className="border border-orange-900/30 bg-orange-500/5 p-6">
          <h2 className="mb-4 font-mono text-sm font-bold tracking-widest text-orange-400">
            YOUR_REFERRAL_CODE
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 border border-zinc-800 bg-black px-4 py-3">
              <p className="font-mono text-xl font-bold tracking-[0.3em] text-zinc-100">
                {referrals?.code || '...'}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="flex h-12 items-center gap-2 border border-zinc-800 bg-zinc-950 px-4 font-mono text-xs tracking-widest text-zinc-300 transition hover:border-orange-800 hover:text-orange-400"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-400" />
                  COPIED
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  COPY
                </>
              )}
            </button>
          </div>
          {shareData?.url && (
            <p className="mt-2 font-mono text-[10px] text-zinc-500">
              Share link: {shareData.url}
            </p>
          )}
        </div>

        {/* Share Buttons */}
        <div className="border border-zinc-900 bg-zinc-950 p-6">
          <h2 className="mb-4 font-mono text-sm font-bold tracking-widest text-zinc-400">
            SHARE_ON_SOCIAL
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { id: 'twitter', icon: Twitter, label: 'Twitter/X', border: 'border-sky-800/40', text: 'text-sky-400', bg: 'bg-sky-500/10' },
              { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', border: 'border-blue-800/40', text: 'text-blue-400', bg: 'bg-blue-500/10' },
              { id: 'facebook', icon: Facebook, label: 'Facebook', border: 'border-blue-700/40', text: 'text-blue-500', bg: 'bg-blue-600/10' },
              { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', border: 'border-green-800/40', text: 'text-green-400', bg: 'bg-green-500/10' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleShare(btn.id)}
                className={cn(
                  'flex items-center gap-2 border px-4 py-3 font-mono text-xs tracking-wider transition hover:opacity-80',
                  btn.border,
                  btn.text,
                  btn.bg,
                )}
              >
                <btn.icon className="h-4 w-4" />
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="border border-zinc-900 bg-zinc-950 p-6">
          <h2 className="mb-4 font-mono text-sm font-bold tracking-widest text-zinc-400">
            HOW_IT_WORKS
          </h2>
          <div className="space-y-3">
            {[
              { step: '01', title: 'Share your code', desc: 'Send your referral link to friends via social media or direct message' },
              { step: '02', title: 'Friend signs up', desc: 'When they create an account using your link, the referral is tracked' },
              { step: '03', title: 'Earn rewards', desc: 'You earn 200 XP + 100 coins for each completed referral. No limits!' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <span className="font-mono text-2xl font-bold text-orange-500/30">
                  {item.step}
                </span>
                <div>
                  <p className="font-mono text-xs font-bold tracking-wider text-zinc-200">
                    {item.title}
                  </p>
                  <p className="font-mono text-[10px] text-zinc-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Referral History */}
        {referrals && referrals.referrals.length > 0 && (
          <div className="border border-zinc-900 bg-zinc-950 p-6">
            <h2 className="mb-4 font-mono text-sm font-bold tracking-widest text-zinc-400">
              REFERRAL_LOG
            </h2>
            <div className="space-y-2">
              {referrals.referrals.map((r: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between border border-zinc-900 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        r.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse',
                      )}
                    />
                    <span className="font-mono text-[10px] tracking-wider text-zinc-400">
                      {r.status === 'completed' ? 'COMPLETED' : 'PENDING'}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-zinc-600">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
