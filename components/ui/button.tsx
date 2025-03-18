import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/* ==================== Button ==================== */

export const buttonVariants = cva(
  'focus-visible:outline-hidden inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md font-medium transition-[color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'shadow-xs bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'shadow-xs bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'shadow-xs bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'shadow-xs border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 gap-1 px-3 text-xs [&_svg]:size-4',
        md: 'h-9 gap-1.5 px-4 text-sm [&_svg]:size-4',
        lg: 'h-10 gap-2 px-5 text-base [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type ButtonProps = React.ComponentPropsWithRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = ({ className, variant, size, asChild = false, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';

  return <Comp className={cn(buttonVariants({ variant, size }), className)} data-slot="button" {...props} />;
};

/* ==================== IconButton ==================== */

export const iconButtonVariants = cva(
  'focus-visible:outline-hidden flex shrink-0 cursor-pointer items-center justify-center rounded-md transition-[color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'shadow-xs bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'shadow-xs bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'shadow-xs bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'shadow-xs border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'size-8 [&_svg]:size-4',
        md: 'size-9 [&_svg]:size-4',
        lg: 'size-10 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type IconButtonProps = React.ComponentPropsWithRef<'button'> &
  VariantProps<typeof iconButtonVariants> & {
    asChild?: boolean;
  };

export const IconButton = ({ className, variant, size, asChild = false, ...props }: IconButtonProps) => {
  const Comp = asChild ? Slot : 'button';

  return <Comp className={cn(iconButtonVariants({ variant, size }), className)} data-slot="icon-button" {...props} />;
};
