import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

import { Header } from '@/components/header';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/hooks/use-sidebar';
import { ColorSchemeProvider } from '@/lib/color-scheme';
import { cn } from '@/lib/utils';

import '@/app/globals.css';

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations({ locale });
  const appTitle = t('app.metadata.title');
  const appTitleTemplate = `%s | ${appTitle}`;

  return {
    title: {
      template: appTitleTemplate,
      default: appTitle,
    },
  };
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Toaster position="top-center" />
          <ColorSchemeProvider>
            <SidebarProvider>
              <TooltipProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex flex-1 flex-col bg-muted/50">{children}</main>
                </div>
              </TooltipProvider>
            </SidebarProvider>
            <TailwindIndicator />
          </ColorSchemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
