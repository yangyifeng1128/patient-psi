/**
 * @file 配色方案设置 Provider
 */
import * as React from 'react';

import { ThemeProvider } from 'next-themes';

import { supportedColorSchemes } from './config';

export const ColorSchemeProvider = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof ThemeProvider>) => {
  const defaultColorSchemeCode = process.env.NEXT_PUBLIC_APP_DEFAULT_COLOR_SCHEME_CODE;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultColorSchemeCode}
      disableTransitionOnChange
      enableColorScheme
      enableSystem={false}
      storageKey="user-color-scheme"
      themes={supportedColorSchemes.map((item) => item.code)}
      {...props}
    >
      {children}
    </ThemeProvider>
  );
};
