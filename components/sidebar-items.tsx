'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { removeChat, shareChat } from '@/app/actions';
import { SidebarActions } from '@/components/sidebar-actions';
import { SidebarItem } from '@/components/sidebar-item';
import { Chat } from '@/lib/types';

interface SidebarItemsProps {
  chats?: Chat[];
}

export function SidebarItems({ chats }: SidebarItemsProps) {
  if (!chats?.length) return null;

  return (
    <AnimatePresence>
      {chats.map(
        (chat, index) =>
          chat && (
            <motion.div
              exit={{
                opacity: 0,
                height: 0,
              }}
              key={chat?.id}
            >
              <SidebarItem chat={chat} index={index}>
                <SidebarActions chat={chat} removeChat={removeChat} shareChat={shareChat} />
              </SidebarItem>
            </motion.div>
          ),
      )}
    </AnimatePresence>
  );
}
