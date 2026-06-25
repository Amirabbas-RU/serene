import { forwardRef, type ButtonHTMLAttributes, type ReactNode, type AnchorHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-clay text-white shadow-sm hover:bg-clay-dark hover:shadow-md',
        secondary:
          'border border-clay/30 bg-transparent text-forest hover:bg-clay/10 hover:border-clay/50',
        ghost:
          'text-forest/70 hover:text-forest hover:bg-forest/5',
        outline:
          'border border-forest/20 bg-transparent text-forest hover:bg-forest/5 hover:border-forest/40',
        'outline-light':
          'border border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white/40',
        'ghost-light':
          'text-white/70 hover:text-white hover:bg-white/10',
        link:
          'text-clay underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

// Button mode — <button> elements
type ButtonMode = Variants & { href?: never } & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'children' | keyof Variants
>;

// Link mode — <a> elements
type LinkMode = Variants & { href: string } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'className' | 'children' | keyof Variants
>;

export type ButtonProps = (ButtonMode | LinkMode) & {
  className?: string;
  children?: ReactNode;
  /** @deprecated Use href instead — component auto-detects link mode. */
  as?: string;
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const { className, variant, size, children, ...rest } = props;
    const classes = cn(buttonVariants({ variant, size, className }));

    if ('href' in props && props.href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...(rest as Omit<LinkMode, keyof Variants>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(rest as Omit<ButtonMode, keyof Variants>)}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
