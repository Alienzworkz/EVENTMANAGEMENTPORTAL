import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={`${sizes[size]} text-primary-500`} />
      </motion.div>
      {text && <p className="text-sm text-[hsl(var(--muted-foreground))]">{text}</p>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader size="lg" text="Loading content..." />
  </div>
);

export const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

export const EventCardSkeleton = () => (
  <div className="glass-card overflow-hidden">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="flex justify-between pt-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3">
    <div className="flex gap-4 p-3">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-3">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className="h-4 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export default Loader;
