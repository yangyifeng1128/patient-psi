'use client';

import * as React from 'react';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { IconSpinner } from '@/components/ui/icons';
import { ServerActionResult } from '@/lib/types';

interface ClearHistoryProps {
  isEnabled: boolean;
  clearChats: () => ServerActionResult<void>;
}

export function ClearHistory({ isEnabled = false, clearChats }: ClearHistoryProps) {
  const t = useTranslations('components.clearHistory.data');

  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild>
        <Button disabled={!isEnabled || isPending} variant="ghost">
          {isPending && <IconSpinner className="mr-2" />}
          {t('clearHistory')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{'Are you absolutely sure?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {'This will permanently delete your chat history and remove your data from our servers.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{'Cancel'}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              startTransition(async () => {
                const result = await clearChats();
                if (result && 'error' in result) {
                  toast.error(result.error);
                  return;
                }

                setOpen(false);
              });
            }}
          >
            {isPending && <IconSpinner className="mr-2 animate-spin" />}
            {'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
