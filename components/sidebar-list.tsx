import { cache } from 'react';

import { clearChats, getChats } from '@/app/actions';
import { ClearHistory } from '@/components/clear-history';
import { SidebarItems } from '@/components/sidebar-items';
import { ThemeToggle } from '@/components/theme-toggle';

interface SidebarListProps {
  userId?: string;
  children?: React.ReactNode;
}

const loadChats = cache(async (userId?: string) => {
  return await getChats(userId);
});

export async function SidebarList({ userId }: SidebarListProps) {
  const chats = await loadChats(userId);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {chats.length > 0 ? (
          <div className="space-y-2 px-2">
            <SidebarItems chats={chats} />
          </div>
        ) : (
          false
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        <ThemeToggle />
        <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} />
      </div>
    </div>
  );
}
