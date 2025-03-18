import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { IconButton } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  useEffect(() => {
    if (pathname === '/' && isRunning) {
      setIsRunning(false);
      setElapsedTime(0);
    } else if (pathname.startsWith('/chat/') && !isRunning) {
      setIsRunning(true);
    }
  }, [pathname, isRunning]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton
          className="absolute left-0 top-[7px] size-12 rounded-full bg-background p-0 sm:left-2"
          variant="outline"
        >
          <span className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
            {formatTime(elapsedTime)}
          </span>
        </IconButton>
      </TooltipTrigger>
      <TooltipContent>{'Stopwatch'}</TooltipContent>
    </Tooltip>
  );
};
