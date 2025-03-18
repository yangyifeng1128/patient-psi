import Link from 'next/link';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import { Separator } from '@/components/ui/separator';
import { UIState } from '@/lib/chat/actions';
import { Session } from '@/lib/types';

export interface ChatList {
  messages: UIState;
  session?: Session;
  isShared: boolean;
}

export function ChatList({ messages, session, isShared }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto w-[540px] px-4">
      {!isShared && !session ? (
        <>
          <div className="group relative mb-4 flex items-start md:-ml-12">
            <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
              <ExclamationTriangleIcon />
            </div>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
              <p className="leading-normal text-muted-foreground">
                {'Please '}
                <Link className="underline" href="/login">
                  {'log in'}
                </Link>
                {' or '}
                <Link className="underline" href="/signup">
                  {'sign up'}
                </Link>
                {' to save and revisit your chat history!'}
              </p>
            </div>
          </div>
          <Separator className="my-4" />
        </>
      ) : null}

      {messages.map((message, index) => (
        <div key={message.id}>
          {message.display}
          {index < messages.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
    </div>
  );
}
