import { useTranslations } from 'next-intl';

import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Session } from '@/lib/types';

export interface UserMenuProps {
  user: Session['user'];
}

function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(' ');
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2);
}

export function UserMenu({ user }: UserMenuProps) {
  const t = useTranslations('components.userMenu.data');

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="pl-0" variant="ghost">
            <div className="flex size-7 shrink-0 select-none items-center justify-center rounded-full bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
              {getUserInitials(user.id)}
            </div>
            <span className="ml-2 hidden md:block">{user.id}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-fit" sideOffset={8}>
          <DropdownMenuLabel className="font-normal">{user.id}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <Button className="w-full font-normal" variant="ghost">
              {t('signOut')}
            </Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
