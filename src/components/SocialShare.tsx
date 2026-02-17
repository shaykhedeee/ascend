// ═══════════════════════════════════════════════════════════════════════════════
// AscendifyIFY - Social Sharing Component
// Share progress, streaks, and achievements on social media
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { 
  Share2, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Copy, 
  Check,
  X,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────────

interface SocialShareProps {
  streakDays?: number;
  habitsCompleted?: number;
  level?: number;
  xpEarned?: number;
  goalProgress?: number;
  customMessage?: string;
  variant?: 'button' | 'card' | 'inline';
  onShare?: (platform: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SHARE URL GENERATORS
// ─────────────────────────────────────────────────────────────────────────────────

const generateShareText = (props: SocialShareProps): string => {
  if (props.customMessage) return props.customMessage;
  
  const parts: string[] = [];
  
  if (props.streakDays && props.streakDays > 0) {
    parts.push(`🔥 ${props.streakDays}-day streak`);
  }
  
  if (props.habitsCompleted && props.habitsCompleted > 0) {
    parts.push(`✅ ${props.habitsCompleted} habits completed today`);
  }
  
  if (props.level && props.level > 1) {
    parts.push(`⭐ Level ${props.level}`);
  }
  
  if (props.goalProgress && props.goalProgress > 0) {
    parts.push(`📈 ${props.goalProgress}% toward my goal`);
  }
  
  if (parts.length === 0) {
    return "I'm building better habits with Ascendify! Join me on the journey.";
  }
  
  return `${parts.join(' | ')}\n\nBuilding better habits with @AscendifyApp 🚀`;
};

const shareUrls = {
  twitter: (text: string, url: string, hashtags: string[] = []) => {
    const params = new URLSearchParams({
      text,
      url,
      hashtags: hashtags.join(','),
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  },
  
  linkedin: (text: string, url: string) => {
    const params = new URLSearchParams({
      mini: 'true',
      url,
      summary: text,
    });
    return `https://www.linkedin.com/shareArticle?${params.toString()}`;
  },
  
  facebook: (url: string) => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  },
  
  whatsapp: (text: string, url: string) => {
    return `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;
  },
  
  telegram: (text: string, url: string) => {
    return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// SOCIAL SHARE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function SocialShare({ 
  streakDays, 
  habitsCompleted, 
  level, 
  xpEarned,
  goalProgress,
  customMessage,
  variant = 'button',
  onShare,
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const shareText = generateShareText({ 
    streakDays, 
    habitsCompleted, 
    level, 
    xpEarned, 
    goalProgress, 
    customMessage 
  });
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ascendify.app';
  const hashtags = ['habits', 'productivity', 'selfimprovement', 'goals'];

  const handleShare = async (platform: string) => {
    onShare?.(platform);
    
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: 'Ascendify Progress',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or error, fall through to modal
      }
    }
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    
    const urls: Record<string, string> = {
      twitter: shareUrls.twitter(shareText, shareUrl, hashtags),
      linkedin: shareUrls.linkedin(shareText, shareUrl),
      facebook: shareUrls.facebook(shareUrl),
      whatsapp: shareUrls.whatsapp(shareText, shareUrl),
      telegram: shareUrls.telegram(shareText, shareUrl),
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
    
    setIsOpen(false);
  };

  const socialButtons = [
    { id: 'twitter', icon: Twitter, label: 'Twitter/X', color: 'hover:bg-sky-500/20 hover:text-sky-400' },
    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-500/20 hover:text-blue-400' },
    { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600/20 hover:text-blue-500' },
    { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: 'hover:bg-green-500/20 hover:text-green-400' },
  ];

  // Button variant - just shows share icon
  if (variant === 'button') {
    return (
      <>
        <button
          onClick={() => {
            if (typeof navigator !== 'undefined' && 'share' in navigator) {
              handleShare('native');
            } else {
              setIsOpen(true);
            }
          }}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-themed-muted hover:text-themed"
          title="Share your progress"
        >
          <Share2 className="w-5 h-5" />
        </button>
        
        {isOpen && <ShareModal onClose={() => setIsOpen(false)} onShare={handleShare} socialButtons={socialButtons} copied={copied} shareText={shareText} />}
      </>
    );
  }

  // Inline variant - row of share buttons
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-themed-muted mr-1">Share:</span>
        {socialButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleShare(btn.id)}
            className={cn(
              "p-2 rounded-lg transition-colors text-themed-muted",
              btn.color
            )}
            title={btn.label}
          >
            <btn.icon className="w-4 h-4" />
          </button>
        ))}
        <button
          onClick={() => handleShare('copy')}
          className="p-2 rounded-lg transition-colors text-themed-muted hover:bg-white/10"
          title="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  // Card variant - full share card with preview
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-themed flex items-center gap-2">
          <Share2 className="w-4 h-4 text-ascend-400" />
          Share Your Progress
        </h3>
      </div>
      
      {/* Preview Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-ascend-500/10 to-gold-400/10 border border-ascend-500/20 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-ascend-500/20 flex items-center justify-center">
            <span className="text-xs font-bold text-ascend-400">A</span>
          </div>
          <span className="text-sm font-semibold text-themed">Ascendify Progress</span>
        </div>
        <p className="text-sm text-themed-secondary whitespace-pre-line">{shareText}</p>
      </div>
      
      {/* Share Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {socialButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleShare(btn.id)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-xl transition-colors bg-[var(--surface)]",
              btn.color
            )}
          >
            <btn.icon className="w-5 h-5" />
            <span className="text-[10px] text-themed-muted">{btn.label}</span>
          </button>
        ))}
      </div>
      
      <button
        onClick={() => handleShare('copy')}
        className="w-full mt-3 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--border)] transition-colors text-sm text-themed-muted flex items-center justify-center gap-2"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy Link
          </>
        )}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// SHARE MODAL
// ─────────────────────────────────────────────────────────────────────────────────

function ShareModal({ 
  onClose, 
  onShare, 
  socialButtons, 
  copied,
  shareText,
}: { 
  onClose: () => void;
  onShare: (platform: string) => void;
  socialButtons: { id: string; icon: React.ElementType; label: string; color: string }[];
  copied: boolean;
  shareText: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm glass-card p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-themed">Share Progress</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Preview */}
        <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] mb-4 text-sm text-themed-secondary">
          {shareText.slice(0, 100)}...
        </div>
        
        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {socialButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => onShare(btn.id)}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl transition-colors bg-[var(--surface)]",
                btn.color
              )}
            >
              <btn.icon className="w-5 h-5" />
              <span className="text-sm">{btn.label}</span>
            </button>
          ))}
        </div>
        
        {/* Copy Button */}
        <button
          onClick={() => onShare('copy')}
          className="w-full py-3 rounded-xl bg-ascend-500/20 hover:bg-ascend-500/30 transition-colors text-ascend-400 flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Copied to Clipboard!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// STREAK SHARE CARD
// ─────────────────────────────────────────────────────────────────────────────────

export function StreakShareCard({ streakDays, habitName }: { streakDays: number; habitName: string }) {
  const milestones = [7, 21, 30, 66, 90, 100, 365];
  const isMilestone = milestones.includes(streakDays);
  
  if (!isMilestone && streakDays % 50 !== 0) return null;
  
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
      <div className="glass-card p-4 flex items-center gap-4 shadow-lg shadow-ascend-500/20">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ascend-500 to-gold-400 flex items-center justify-center">
          <span className="text-lg font-bold">🔥</span>
        </div>
        <div>
          <p className="font-semibold text-themed">{streakDays}-Day Streak!</p>
          <p className="text-xs text-themed-muted">{habitName}</p>
        </div>
        <SocialShare 
          streakDays={streakDays} 
          customMessage={`Just hit a ${streakDays}-day streak on "${habitName}"! 🔥\n\nBuilding better habits with @AscendifyApp`}
          variant="button" 
        />
      </div>
    </div>
  );
}
