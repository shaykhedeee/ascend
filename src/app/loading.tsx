// ═══════════════════════════════════════════════════════════════════════════════
// AscendifyIFY - Loading State
// Shows while page content is being loaded
// ═══════════════════════════════════════════════════════════════════════════════

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#14B899] to-[#FBBF24] opacity-20 animate-pulse" />
          <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-[#14B899] to-[#FBBF24] animate-pulse" 
               style={{ animationDelay: '0.15s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-white animate-bounce"
              style={{ animationDuration: '1s' }}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5"
            >
              <path d="M12 2L12 22M12 2L6 8M12 2L18 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        
        <p className="text-[var(--text-secondary)] text-sm animate-pulse">
          Loading your journey...
        </p>
      </div>
    </div>
  );
}
