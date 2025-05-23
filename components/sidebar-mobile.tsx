'use client';

import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { IconSidebar } from '@/components/ui/icons';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SidebarMobileProps {
  children: React.ReactNode;
}

export function SidebarMobile({ children }: SidebarMobileProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="-ml-2 flex size-9 p-0 lg:hidden" variant="ghost">
          <IconSidebar className="size-6" />
          <span className="sr-only">{'Toggle Sidebar'}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="inset-y-0 flex h-auto w-[300px] flex-col p-0" side="left">
        <Sidebar className="flex">{children}</Sidebar>
      </SheetContent>
    </Sheet>
  );
}
