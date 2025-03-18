'use client';

import { ThemeProvider } from 'next-themes';

import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/lib/hooks/use-sidebar';

export function Providers({ children, ...props }: React.ComponentPropsWithoutRef<typeof ThemeProvider>) {
  return (
    <ThemeProvider {...props}>
      <SidebarProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
