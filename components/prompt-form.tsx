'use client';

import * as React from 'react';

import { useActions, useUIState } from 'ai/rsc';
import { CornerDownLeftIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import Textarea from 'react-textarea-autosize';

import { IconButton } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEnterSubmit } from '@/hooks/use-enter-submit';
import { type AI } from '@/lib/chat/actions';
import { UserMessage } from './message';
import { Stopwatch } from './stopwatch';

export function PromptForm({ input, setInput }: { input: string; setInput: (value: string) => void }) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { submitUserMessage } = useActions();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setMessages] = useUIState<typeof AI>();

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          (e.target as HTMLFormElement)['message']?.blur();
        }

        const value = input.trim();
        setInput('');
        if (!value) return;

        // Optimistically add user message UI
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>,
          },
        ]);

        // Submit and get response message
        const responseMessage = await submitUserMessage(value);
        setMessages((currentMessages) => [...currentMessages, responseMessage]);
      }}
      ref={formRef}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Stopwatch />
        <Textarea
          autoComplete="off"
          autoCorrect="off"
          autoFocus
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          name="message"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          ref={inputRef}
          rows={1}
          spellCheck={false}
          tabIndex={0}
          value={input}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton className="rounded-full" disabled={input === ''} type="submit">
                <CornerDownLeftIcon strokeWidth="3" />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>{'Send message'}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}
