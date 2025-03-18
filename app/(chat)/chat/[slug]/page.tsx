import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { getChat, getMissingKeys } from '@/app/actions';
import { auth } from '@/auth';
import { Chat } from '@/components/chat';
import { AI } from '@/lib/chat/actions';
import { Session } from '@/lib/types';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {};
  }

  const chat = await getChat(slug, userId);
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat',
  };
}

export default async function ChatPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = (await auth()) as Session;
  const missingKeys = await getMissingKeys();

  if (!session?.user) {
    redirect(`/login?next=/chat/${slug}`);
  }

  const userId = session.user.id as string;
  const chat = await getChat(slug, userId);

  if (!chat) {
    redirect('/');
  }

  if (chat?.userId !== session?.user?.id) {
    notFound();
  }

  return (
    <AI initialAIState={{ chatId: chat.id, messages: chat.messages }}>
      <Chat id={chat.id} initialMessages={chat.messages} missingKeys={missingKeys} session={session} />
    </AI>
  );
}
