'use client';

import * as React from 'react';

import { useSidebar } from '@/lib/hooks/use-sidebar';
import { cn } from '@/lib/utils';

export type SidebarProps = React.ComponentProps<'div'> & {};

export function Sidebar({ className, children }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useSidebar();

  return (
    <div
      className={cn(className, 'h-full flex-col dark:bg-zinc-950')}
      data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
    >
      {children}
    </div>
  );
}
