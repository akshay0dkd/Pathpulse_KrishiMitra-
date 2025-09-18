
'use client';

import { processUserMessage, type Message as MessageType } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Bot, Send, User, BrainCircuit } from 'lucide-react';
import React, { useEffect, useRef, useState, useTransition } from 'react';

type ChatInterfaceProps = {
  initialMessage: MessageType;
};

const UserMessage = ({ content }: { content: string }) => (
  <div className="flex items-start gap-3 justify-end">
    <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-2xl bg-primary text-primary-foreground p-3 shadow-md">
      <p className="text-sm whitespace-pre-wrap">{content}</p>
    </div>
    <div className="bg-primary/10 p-2.5 rounded-full">
      <User className="h-5 w-5 text-primary" />
    </div>
  </div>
);

const AssistantMessage = ({ content }: { content: string }) => (
  <div className="flex items-start gap-3">
    <div className="bg-muted p-2.5 rounded-full">
      <Bot className="h-5 w-5 text-muted-foreground" />
    </div>
    <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-2xl bg-card border p-3 shadow-sm">
      <p className="text-sm text-foreground whitespace-pre-wrap">{content}</p>
    </div>
  </div>
);

const TypingIndicator = () => (
    <div className="flex items-center gap-3">
        <div className="bg-muted p-2.5 rounded-full">
            <Bot className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="rounded-2xl bg-card border p-3 shadow-sm">
            <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
            </div>
        </div>
    </div>
)

export default function ChatInterface({ initialMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<MessageType[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      const response = await processUserMessage(messages, input);
      
      const assistantMessage: MessageType = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
      };

      if (!response) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to get a response from the assistant. Please try again.",
        })
      }
      setMessages((prev) => [...prev, assistantMessage]);
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 md:p-6 space-y-6">
          {messages.map((msg) =>
            msg.role === 'assistant' ? (
              <AssistantMessage key={msg.id} content={msg.content} />
            ) : (
              <UserMessage key={msg.id} content={msg.content} />
            )
          )}
           {isPending && <TypingIndicator />}
        </div>
      </ScrollArea>

      <div className="border-t bg-card p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക... (Type your question here...)"
            className="pr-12 h-12 text-base rounded-full pl-6 shadow-inner bg-background"
            disabled={isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 -translate-y-1/2 right-2 rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
            disabled={isPending || !input.trim()}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
         <p className="text-center text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
            <BrainCircuit className="h-3 w-3" />
            <span>Powered by AI. Responses may be experimental.</span>
        </p>
      </div>
    </div>
  );
}
