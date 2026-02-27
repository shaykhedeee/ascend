/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand – Vitality Terminal: Rust × Black
        ascend: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#EA580C', // primary CTA rust
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        rust: {
          400: '#FB923C',
          500: '#EA580C',
          600: '#C2410C',
          dim: '#431407',
        },
        terminal: {
          bg: '#000000',
          panel: '#09090B',
          border: '#18181B',
          muted: '#27272A',
        },
        // Status colors
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Cascadia Code"', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'flicker': 'flicker 4s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'level-up': 'levelUp 0.6s ease-out forwards',
        'type-in': 'typeIn 0.4s steps(20, end)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '8%': { opacity: '0.93' },
          '9%': { opacity: '1' },
          '42%': { opacity: '1' },
          '43%': { opacity: '0.88' },
          '44%': { opacity: '1' },
          '76%': { opacity: '1' },
          '77%': { opacity: '0.92' },
          '78%': { opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(234, 88, 12, 0.4)' },
          '100%': { boxShadow: '0 0 20px rgba(234, 88, 12, 0.7)' },
        },
        levelUp: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        typeIn: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      boxShadow: {
        'rust-sm': '0 0 10px rgba(234, 88, 12, 0.25)',
        'rust-md': '0 0 20px rgba(234, 88, 12, 0.35)',
        'rust-lg': '0 0 30px rgba(234, 88, 12, 0.45)',
        'glow-sm': '0 0 10px rgba(234, 88, 12, 0.3)',
        'glow-md': '0 0 20px rgba(234, 88, 12, 0.4)',
        'glow-lg': '0 0 30px rgba(234, 88, 12, 0.5)',
        'panel': 'inset 0 1px 0 rgba(255,255,255,0.03)',
      },
    },
  },
  plugins: [],
}
