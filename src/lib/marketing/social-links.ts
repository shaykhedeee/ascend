export const MARKETING_SOCIAL_LINKS = [
  { icon: '𝕏', label: 'X', href: 'https://twitter.com/resurgolife' },
  { icon: '✈', label: 'Telegram', href: 'https://t.me/ResurgoApp' },
  { icon: 'in', label: 'LinkedIn', href: 'https://linkedin.com/company/resurgo' },
  { icon: '▶', label: 'YouTube', href: 'https://youtube.com/@resurgo' },
] as const;

export const MARKETING_SOCIAL_URLS = MARKETING_SOCIAL_LINKS.map((link) => link.href);
