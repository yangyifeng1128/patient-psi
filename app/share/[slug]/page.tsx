import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getSharedChat } from '@/app/actions';
import { ChatList } from '@/components/chat-list';
import { FooterText } from '@/components/footer';
import { AI, getUIStateFromAIState, UIState } from '@/lib/chat/actions';
import { formatDate } from '@/lib/utils';

export const runtime = 'edge';
export const preferredRegion = 'home';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const chat = await getSharedChat(slug);

  return {
    title: chat?.title.slice(0, 50) ?? 'Chat',
  };
}

export default async function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chat = await getSharedChat(slug);

  if (!chat || !chat?.sharePath) {
    notFound();
  }

  const uiState: UIState = getUIStateFromAIState(chat);

  return (
    <>
      <div className="flex-1 space-y-6">
        <div className="border-b bg-background px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-2xl">
            <div className="space-y-1 md:-mx-8">
              <h1 className="text-2xl font-bold">{chat.title}</h1>
              <div className="text-sm text-muted-foreground">
                {formatDate(chat.createdAt)}
                {' · '}
                {chat.messages.length} {' messages '}
              </div>
            </div>
          </div>
        </div>
        <AI>
          <ChatList isShared={true} messages={uiState} />
        </AI>
      </div>
      <FooterText className="py-8" />
    </>
  );
}
