'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAIState, useUIState } from 'ai/rsc';

import { initialProfile, PatientProfile } from '@/app/api/data/patient-profiles';
import { ChatList } from '@/components/chat-list';
import { ChatPanel } from '@/components/chat-panel';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useScrollAnchor } from '@/hooks/use-scroll-anchor';
import { Message } from '@/lib/chat/actions';
import { Session } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DiagramList } from './diagram-list';
import { Sidebar } from './sidebar';
import { StartSession } from './start-session';

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
  session?: Session;
}

export function Chat({ id, className, session }: ChatProps) {
  const router = useRouter();
  const path = usePathname();
  const [input, setInput] = useState('');
  const [messages] = useUIState();
  const [aiState] = useAIState();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setNewChatId] = useLocalStorage('newChatId', id);
  const [isStarted, setIsStarted] = useState(false);
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(initialProfile);

  useEffect(() => {
    if (session?.user) {
      if (!path.includes('chat') && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`);
      }
    }
  }, [id, path, session?.user, messages]);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  useEffect(() => {
    setNewChatId(id);
  });

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } = useScrollAnchor();

  const handleStartedChange = (isStarted: boolean) => {
    setIsStarted(isStarted);
  };

  const handleSetPatientProfile = (patientProfile: PatientProfile) => {
    setPatientProfile(patientProfile);
    console.log('profile');
    console.log(patientProfile);
  };

  if (!id || !session) {
    return false;
  }

  return (
    <>
      <div
        className="group ml-[-14%] w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
        ref={scrollRef}
      >
        {messages.length ? (
          <>
            <div className={cn('pb-[200px] pt-4 md:pt-10', className)} ref={messagesRef}>
              <ChatList isShared={false} messages={messages} session={session} />
              <div className="h-px w-full" ref={visibilityRef} />
            </div>
            <ChatPanel
              id={id}
              input={input}
              isAtBottom={isAtBottom}
              scrollToBottom={scrollToBottom}
              setInput={setInput}
            />
          </>
        ) : (
          <>
            {!isStarted ? (
              <div className={cn('pb-[200px] pt-4 md:pt-10', className)} ref={messagesRef}>
                <StartSession onSetPatientProfile={handleSetPatientProfile} onStartedChange={handleStartedChange} />
              </div>
            ) : (
              <>
                <div className={cn('pb-[200px] pt-4 md:pt-10', className)} ref={messagesRef}>
                  <div className="mx-auto max-w-2xl px-4">
                    <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
                      <h1 className="text-xl font-semibold">{'开启新的对话'}</h1>
                      <label className="pt-4 text-lg font-semibold leading-normal text-blue-600">
                        {patientProfile.name}
                        {' 的过往经历'}
                        {'：'}
                      </label>
                      <p className="pt-2 font-medium leading-normal text-blue-600">{patientProfile.history}</p>
                      <p className="pt-1 font-light leading-normal text-black dark:text-white">
                        {'（过往经历将在整个对话期间显示在右侧边栏中）'}
                      </p>
                      <p className="pt-4 font-medium leading-normal text-black dark:text-white">
                        {'请在下面的文本框中输入对 '}
                        <b>{patientProfile.name}</b>
                        {' 的问候语，开始会话。'}
                      </p>
                      <label className="block pt-1 font-medium leading-normal text-red-500">
                        <span className="font-bold">{'预计对话时间约为 10 分钟。'}</span>
                      </label>
                    </div>
                  </div>
                </div>
                <ChatPanel
                  id={id}
                  input={input}
                  isAtBottom={isAtBottom}
                  scrollToBottom={scrollToBottom}
                  setInput={setInput}
                />
              </>
            )}
          </>
        )}
      </div>
      {messages.length ? (
        <Sidebar className="peer absolute inset-y-0 right-0 z-30 hidden translate-x-full border-l bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[400px] xl:w-[600px]">
          <DiagramList chatId={id} patientProfile={patientProfile} userId={session.user.id} />
        </Sidebar>
      ) : (
        <></>
      )}
    </>
  );
}
