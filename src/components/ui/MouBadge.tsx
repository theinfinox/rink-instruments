interface MouBadgeProps {
  hasVerifiedMou?: boolean;
  className?: string;
}

/**
 * Minimal MoU Badge for verified KSUM MoU institutions.
 * Renders ONLY when hasVerifiedMou is true.
 */
export default function MouBadge({ hasVerifiedMou, className = '' }: MouBadgeProps) {
  if (!hasVerifiedMou) return null;

  return (
    <span 
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 leading-none ${className}`}
    >
      MoU
    </span>
  );
}
