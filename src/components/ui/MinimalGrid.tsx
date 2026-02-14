import { cn } from '@/lib/utils';

interface MinimalGridProps {
  className?: string;
  animated?: boolean;
  dotOverlay?: boolean;
}

export function MinimalGrid({
  className,
  animated = true,
  dotOverlay = true,
}: MinimalGridProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <div className={cn('absolute inset-0 minimal-grid', animated && 'minimal-grid-animated')} />
      {dotOverlay && <div className="absolute inset-0 minimal-grid-dots opacity-50" />}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.10),transparent_40%)]" />
    </div>
  );
}
