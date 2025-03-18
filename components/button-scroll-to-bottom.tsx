'use client';

import { ComponentPropsWithRef } from 'react';

import { ArrowDownToLineIcon } from 'lucide-react';

import { IconButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonScrollToBottomProps extends ComponentPropsWithRef<typeof IconButton> {
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export function ButtonScrollToBottom({ className, isAtBottom, scrollToBottom, ...props }: ButtonScrollToBottomProps) {
  return (
    <IconButton
      className={cn(
        'absolute right-4 top-1 z-10 rounded-full bg-background transition-opacity duration-300 sm:right-8 md:top-2',
        isAtBottom ? 'opacity-0' : 'opacity-100',
        className,
      )}
      onClick={() => scrollToBottom()}
      variant="outline"
      {...props}
    >
      <ArrowDownToLineIcon />
    </IconButton>
  );
}
