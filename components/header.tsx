import * as React from 'react';
import Link from 'next/link';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { IconNextChat, IconSeparator } from '@/components/ui/icons';
import { UserMenu } from '@/components/user-menu';
import { Session } from '@/lib/types';
import { ChatHistory } from './chat-history';
import { SidebarMobile } from './sidebar-mobile';

async function UserOrLogin() {
  const session = (await auth()) as Session;
  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          {/* <SidebarToggle /> */}
        </>
      ) : (
        <Link href="/new" rel="nofollow">
          <IconNextChat className="mr-2 size-6 dark:hidden" inverted />
          <IconNextChat className="mr-2 hidden size-6 dark:block" />
        </Link>
      )}
      <div className="flex items-center">
        <IconSeparator className="size-6 text-muted-foreground/50" />
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button asChild className="-ml-2" variant="link">
            <Link href="/login">{'Login'}</Link>
          </Button>
        )}
      </div>
    </>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {/* <a
          target="_blank"
          href="https://github.com/vercel/nextjs-ai-chatbot/"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <IconGitHub />
          <span className="hidden ml-2 md:flex">GitHub</span>
        </a>
        <a
          href="https://vercel.com/templates/Next.js/nextjs-ai-chatbot"
          target="_blank"
          className={cn(buttonVariants())}
        >
          <IconVercel className="mr-2" />
          <span className="hidden sm:block">Deploy to Vercel</span>
          <span className="sm:hidden">Deploy</span>
        </a> */}
        {/* <SidebarMobile>
          something
        </SidebarMobile> */}
      </div>
    </header>
  );
}
