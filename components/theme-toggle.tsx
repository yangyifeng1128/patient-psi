'use client';

import * as React from 'react';

import { useTheme } from 'next-themes';

import { IconButton } from '@/components/ui/button';
import { IconMoon, IconSun } from '@/components/ui/icons';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = React.useTransition();

  return (
    <IconButton
      onClick={() => {
        startTransition(() => {
          setTheme(theme === 'light' ? 'dark' : 'light');
        });
      }}
      variant="ghost"
    >
      {!theme ? null : theme === 'dark' ? (
        <IconMoon className="transition-all" />
      ) : (
        <IconSun className="transition-all" />
      )}
      <span className="sr-only">{'Toggle theme'}</span>
    </IconButton>
  );
}
