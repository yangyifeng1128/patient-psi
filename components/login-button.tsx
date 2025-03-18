'use client';

import * as React from 'react';

import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { IconGitHub, IconSpinner } from '@/components/ui/icons';

type LoginButtonProps = React.ComponentPropsWithRef<typeof Button> & {
  showGithubIcon?: boolean;
  text?: string;
};

export function LoginButton({ text = 'Login with GitHub', showGithubIcon = true, ...props }: LoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <Button
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
        signIn('github', { callbackUrl: `/` });
      }}
      variant="outline"
      {...props}
    >
      {isLoading ? (
        <IconSpinner className="mr-2 animate-spin" />
      ) : showGithubIcon ? (
        <IconGitHub className="mr-2" />
      ) : null}
      {text}
    </Button>
  );
}
