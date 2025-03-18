import 'server-only';

import { createAzure } from '@ai-sdk/azure';
import { createAI, createStreamableValue, getAIState, getMutableAIState, streamUI } from 'ai/rsc';

import { saveChat } from '@/app/actions';
import { getPrompt } from '@/app/api/getDataFromKV';
import { auth } from '@/auth';
import { BotMessage, SpinnerMessage, UserMessage } from '@/components/message';
import { Chat } from '@/lib/types';
import { nanoid } from '@/lib/utils';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || '',
// });

const azure = createAzure({
  resourceName: 'aixinquegpt4',
  apiKey: 'ef0f7cbdc8fc47afbb20f7a9c54c8f21',
});

async function submitUserMessage(content: string) {
  'use server';

  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content,
      },
    ],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const ui = await streamUI({
    model: azure('GPT4'),
    initial: <SpinnerMessage />,
    messages: [
      {
        role: 'system',
        content: await getPrompt(),
      },
      ...aiState.get().messages.map((message: Message) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('');
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content,
            },
          ],
        });
      } else {
        textStream.update(delta);
      }

      return textNode;
    },
  });

  // const ui = render({
  //   model: 'gpt-4',
  //   provider: openai,
  //   initial: <SpinnerMessage />,
  //   messages: [
  //     {
  //       role: 'system',
  //       content: await getPrompt()
  //     },
  //     ...aiState.get().messages.map((message: any) => ({
  //       role: message.role,
  //       content: message.content,
  //       name: message.name
  //     }))
  //   ],
  //   text: ({ content, done, delta }) => {
  //     if (!textStream) {
  //       textStream = createStreamableValue('')
  //       textNode = <BotMessage content={textStream.value} />
  //     }

  //     if (done) {
  //       textStream.done()
  //       aiState.done({
  //         ...aiState.get(),
  //         messages: [
  //           ...aiState.get().messages,
  //           {
  //             id: nanoid(),
  //             role: 'assistant',
  //             content
  //           }
  //         ]
  //       })
  //     } else {
  //       textStream.update(delta)
  //     }

  //     return textNode
  //   }
  // })

  return {
    id: nanoid(),
    display: ui.value,
  };
}

export type Message = {
  role: 'system' | 'user' | 'assistant' | 'data';
  content: string;
  id: string;
  name?: string;
};

export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server';

    const session = await auth();

    if (session && session.user) {
      const aiState = getAIState();

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState as Chat);
        return uiState;
      }
    } else {
      return;
    }
  },
  onSetAIState: async ({ state }) => {
    'use server';

    const session = await auth();

    if (session && session.user) {
      const { chatId, messages } = state;

      const createdAt = new Date();
      const userId = session.user.id as string;
      const path = `/chat/${chatId}`;
      const title = messages[0].content.substring(0, 100);

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path,
      };

      await saveChat(chat);
    } else {
      return;
    }
  },
});

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.id}-${index}`,
      display:
        message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        ),
    }));
};
