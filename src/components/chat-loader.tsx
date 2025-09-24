'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { Message } from '@/app/actions';
import { forwardRef } from 'react';

const ChatInterfaceWithNoSSR = dynamic(
  () => import('@/components/chat-interface'),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-full p-4 space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-16 w-1/2 rounded-2xl" />
        </div>
        <div className="flex items-start gap-3 justify-end">
          <Skeleton className="h-10 w-1/3 rounded-2xl" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    ),
  }
);

type ChatLoaderProps = {
  initialMessage: Message;
  language: string;
};

type ChatLoaderHandle = {
  triggerAction: (action: 'weather' | 'schemes', lang: string) => void;
  resetChat: (newMessage: Message) => void;
};

export const ChatLoader = forwardRef<ChatLoaderHandle, ChatLoaderProps>(
  ({ initialMessage, language }, ref) => {
    return <ChatInterfaceWithNoSSR initialMessage={initialMessage} language={language} ref={ref} />;
  }
);

ChatLoader.displayName = 'ChatLoader';
