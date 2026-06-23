import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';
import type { HTMLAttributes } from 'react';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'bg-clay/10 text-clay-dark border border-clay/20',
        secondary: 'bg-forest/10 text-forest border border-forest/20',
        outline: 'border border-forest/20 bg-transparent text-forest/70',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
