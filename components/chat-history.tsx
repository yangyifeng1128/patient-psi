import * as React from 'react';
import Link from 'next/link';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SidebarList } from '@/components/sidebar-list';
import { Button } from '@/components/ui/button';

interface ChatHistoryProps {
  userId?: string;
}

export function ChatHistory({ userId }: ChatHistoryProps) {
  const t = useTranslations('components.chatHistory.data');

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        <h4 className="text-sm font-medium">{t('chatHistory')}</h4>
      </div>
      <div className="mb-2 px-2">
        <Button asChild className="w-full" variant="outline">
          <Link href="/">
            <PlusIcon />
            {t('newChat')}
          </Link>
        </Button>
      </div>
      <React.Suspense
        fallback={
          <div className="flex flex-1 flex-col space-y-4 overflow-auto px-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div className="h-6 w-full shrink-0 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" key={i} />
            ))}
          </div>
        }
      >
        <SidebarList userId={userId} />
      </React.Suspense>
    </div>
  );
}
