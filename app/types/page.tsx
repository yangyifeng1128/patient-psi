import { auth } from '@/auth';
import { Chat } from '@/components/chat';
import { AI } from '@/lib/chat/actions';
import { Session } from '@/lib/types';
import { nanoid } from '@/lib/utils';
import { getMissingKeys } from '../actions';

export interface ChatPageProps {
  params: {
    id: string;
    patient_type: string;
  };
}

export default async function ChatPage({}: ChatPageProps) {
  const id = nanoid();
  const session = (await auth()) as Session;
  const missingKeys = await getMissingKeys();

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} missingKeys={missingKeys} session={session} />
    </AI>
  );
}
