'use client';

import { StreamableValue } from 'ai/rsc';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { IconOpenAI, IconUser } from '@/components/ui/icons';
import { useStreamableText } from '@/hooks/use-streamable-text';
import { cn } from '@/lib/utils';
import { MemoizedReactMarkdown } from './markdown';
import { spinner } from './spinner';
import { CodeBlock } from './ui/codeblock';

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">{children}</div>
    </div>
  );
}

export function BotMessage({ content, className }: { content: string | StreamableValue<string>; className?: string }) {
  const text = useStreamableText(content);

  return (
    <div className={cn('group relative flex items-start md:-ml-12', className)}>
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
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
          {text}
        </MemoizedReactMarkdown>
      </div>
    </div>
  );
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className={'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'}>
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  );
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 flex h-[24px] flex-1 flex-row items-center space-y-2 overflow-hidden px-1">{spinner}</div>
    </div>
  );
}
