// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from 'ai';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { ChatMessageActions } from '@/components/chat-message-actions';
import { MemoizedReactMarkdown } from '@/components/markdown';
import { CodeBlock } from '@/components/ui/codeblock';
import { IconOpenAI, IconUser } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div className={cn('group relative mb-4 flex items-start md:-ml-12')} {...props}>
      <div
        className={cn(
          'flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user' ? 'bg-background' : 'bg-primary text-primary-foreground',
        )}
      >
        {message.role === 'user' ? <IconUser /> : <IconOpenAI />}
      </div>
      <div className="prose ml-4 flex-1 space-y-2 overflow-hidden break-words px-1 dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
        <MemoizedReactMarkdown
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            code({ className, children, ...props }) {
              const arr = children as React.ReactNode[];
              if (arr && arr.length) {
                if (arr[0] == '▍') {
                  return <span className="mt-1 animate-pulse cursor-default" />;
                }
                arr[0] = (arr[0] as string).replace('`▍`', '▍');
              }

              const match = /language-(\w+)/.exec(className || '');

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              );
            },
          }}
          remarkPlugins={[remarkGfm, remarkMath]}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  );
}
