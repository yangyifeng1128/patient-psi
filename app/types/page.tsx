import { auth } from '@/auth';
import { Chat } from '@/components/chat';
import { AI } from '@/lib/chat/actions';
import { Session } from '@/lib/types';
import { nanoid } from '@/lib/utils';

export default async function ChatPage() {
  const id = nanoid();
  const session = (await auth()) as Session;

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session} />
    </AI>
  );
}
