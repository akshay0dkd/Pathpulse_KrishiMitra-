
'use client';

import { processUserMessage, processVoiceModeMessage, type Message as MessageType } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Bot, Send, User, BrainCircuit, Mic, Paperclip, X, EarOff } from 'lucide-react';
import React, { useEffect, useRef, useState, useTransition, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';

type ChatInterfaceProps = {
  initialMessage: MessageType;
};

type ChatInterfaceHandle = {
  triggerAction: (action: 'weather' | 'schemes') => void;
};

const UserMessage = ({ content, image }: { content: string, image?: string }) => (
  <div className="flex items-start gap-3 justify-end">
    <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-2xl bg-primary text-primary-foreground p-3 shadow-md">
      {image && <Image src={image} alt="User upload" width={200} height={200} className="rounded-md mb-2" />}
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

const ChatInterface = forwardRef<ChatInterfaceHandle, ChatInterfaceProps>(({ initialMessage }, ref) => {
  const [messages, setMessages] = useState<MessageType[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const sendMessage = (messageText: string, imageUri?: string, imagePreviewUri?: string) => {
     if (isPending) return;

    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageText,
      image: imagePreviewUri,
    };
    
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);

    startTransition(async () => {
      const response = isVoiceMode 
        ? await processVoiceModeMessage(currentMessages, messageText)
        : await processUserMessage(messages, messageText, imageUri);
      
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
  }

  useImperativeHandle(ref, () => ({
    triggerAction: (action: 'weather' | 'schemes') => {
      if (action === 'weather') {
        sendMessage('What is the weather forecast and advice for my farming activities this week?');
      } else if (action === 'schemes') {
        sendMessage('What are the government schemes I can apply for?');
      }
    },
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(URL.createObjectURL(file));
        setImageData(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if ((!input.trim() && !imageData) || isPending) return;

    sendMessage(input, imageData || undefined, imagePreview || undefined);

    setInput('');
    setImagePreview(null);
    setImageData(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  const clearImage = () => {
    setImagePreview(null);
    setImageData(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const toggleVoiceMode = () => {
    setIsVoiceMode(prev => {
        if (!prev) { // Entering voice mode
            const voiceGreeting: MessageType = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: "Welcome to KrishiMitra Voice Help. You can speak to me in Malayalam or English. Please tell me your problem in a sentence or two. For example, you can say, 'My banana leaves have yellow spots,' or 'വാഴയിലെ പുള്ളികൾക്ക് എന്ത് ചെയ്യണം?'\n\nI am listening..."
            };
            setMessages(prevMsgs => [...prevMsgs, voiceGreeting]);
            clearImage();
        } else { // Exiting voice mode
             const exitMessage: MessageType = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: "Exiting voice mode."
            };
            setMessages(prevMsgs => [...prevMsgs, exitMessage]);
        }
        return !prev;
    });
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 md:p-6 space-y-6">
          {messages.map((msg) =>
            msg.role === 'assistant' ? (
              <AssistantMessage key={msg.id} content={msg.content} />
            ) : (
              <UserMessage key={msg.id} content={msg.content} image={msg.image} />
            )
          )}
           {isPending && <TypingIndicator />}
        </div>
      </ScrollArea>

      <div className="border-t bg-card p-4">
        {imagePreview && !isVoiceMode && (
          <div className="relative w-24 h-24 mb-2">
            <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" className="rounded-md" />
            <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={clearImage}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2">
           <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <Button type="button" size="icon" variant="ghost" className="h-12 w-12 rounded-full" onClick={() => fileInputRef.current?.click()} disabled={isPending || isVoiceMode}>
            <Paperclip className="h-6 w-6" />
          </Button>
           <Button type="button" size="icon" variant={isVoiceMode ? "secondary" : "ghost"} className="h-12 w-12 rounded-full" onClick={toggleVoiceMode} disabled={isPending}>
            {isVoiceMode ? <EarOff className="h-6 w-6 text-destructive" /> : <Mic className="h-6 w-6" />}
          </Button>
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isVoiceMode ? "Speak your query..." : "നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക... (Type your question here...)"}
              className="pr-12 h-12 text-base rounded-full pl-6 shadow-inner bg-background"
              disabled={isPending}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute top-1/2 -translate-y-1/2 right-2 rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
              disabled={isPending || (!input.trim() && !imageData)}
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
         <p className="text-center text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
            <BrainCircuit className="h-3 w-3" />
            <span>Powered by AI. Responses may be experimental.</span>
        </p>
      </div>
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';
export default ChatInterface;
