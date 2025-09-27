'use client';

import { processUserMessage, processVoiceModeMessage, type Message as MessageType } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Bot, Send, User, BrainCircuit, Mic, X, Ear, Camera, Upload, Video, Bug, CloudSun, Landmark } from 'lucide-react';
import React, { useEffect, useRef, useState, useTransition, useImperativeHandle, forwardRef } from 'react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { HowItWorksGuide } from './how-it-works-guide';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { CameraCapture } from './camera-capture';

type ChatInterfaceProps = {
  initialMessage: MessageType;
  language: string;
  onWeatherClick: () => void;
};

type ChatInterfaceHandle = {
  triggerAction: (action: 'schemes' | 'pests' | 'weather', lang: string, query?: string) => void;
  resetChat: (newMessage: MessageType) => void;
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

type DialogMode = 'closed' | 'picker' | 'camera';

const ChatInterface = forwardRef<ChatInterfaceHandle, ChatInterfaceProps>(({ initialMessage, language, onWeatherClick }, ref) => {
  const [messages, setMessages] = useState<MessageType[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>('closed');
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
  
  useEffect(() => {
    if (imageData) {
      const messageContent = input || 'Please analyze this image.';
      sendMessage(messageContent, language, imageData, imagePreview || undefined);
      
      setInput('');
      setImagePreview(null);
      setImageData(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData, input, language]);

  const sendMessage = (messageText: string, lang: string, imageUri?: string, imagePreviewUri?: string) => {
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
        ? await processVoiceModeMessage(currentMessages, messageText, lang)
        : await processUserMessage(messages, messageText, lang, imageUri);
      
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
    triggerAction: (action: 'schemes' | 'pests' | 'weather', lang: string, query?: string) => {
       if (action === 'weather') {
        onWeatherClick();
        return;
       }
       if (query) {
         sendMessage(query, lang);
         return;
       }
      const questions = {
        'schemes': {
          'en-IN': 'What government schemes can I apply for?',
          'ml-IN': 'എനിക്ക് അപേക്ഷിക്കാൻ കഴിയുന്ന സർക്കാർ പദ്ധതികൾ ഏതൊക്കെയാണ്?',
          'hi-IN': 'मैं किन सरकारी योजनाओं के लिए आवेदन कर सकता हूँ?',
          'mr-IN': 'मी कोणत्या सरकारी योजनांसाठी अर्ज करू शकतो?',
        },
        'pests': {
          'en-IN': 'My leaves have yellow spots. What could it be?',
          'ml-IN': 'എന്റെ ഇലകളിൽ മഞ്ഞ പാടുകൾ ഉണ്ട്. അതെന്തായിരിക്കും?',
          'hi-IN': 'मेरी पत्तियों पर पीले धब्बे हैं। यह क्या हो सकता है?',
          'mr-IN': 'माझ्या पानांवर पिवळे डाग आहेत. ते काय असू शकते?',
        }
      }
      sendMessage(questions[action][lang as keyof typeof questions[typeof action]] || questions[action]['en-IN'], lang);
    },
    resetChat: (newMessage: MessageType) => {
      setMessages([newMessage]);
    }
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDialogMode('closed');
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
    if (!input.trim() || isPending) return;
    sendMessage(input, language);
    setInput('');
  };
  
  const handlePhotoTaken = (dataUri: string) => {
    setDialogMode('closed');
    setImagePreview(dataUri);
    setImageData(dataUri);
  }

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
  
  const isInitialState = messages.length <= 1;

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        {isInitialState && <HowItWorksGuide />}
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
        {imagePreview && !isPending && (
          <div className="relative w-24 h-24 mb-2">
            <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" className="rounded-md" />
            <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={clearImage}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2">
           <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
           
           <Button type="button" size="icon" variant={isVoiceMode ? "secondary" : "ghost"} className="shrink-0 h-12 w-12 rounded-full" onClick={toggleVoiceMode} disabled={isPending}>
            {isVoiceMode ? <X className="h-6 w-6 text-destructive" /> : <Mic className="h-6 w-6" />}
          </Button>
          
          <Dialog open={dialogMode !== 'closed'} onOpenChange={(open) => setDialogMode(open ? 'picker' : 'closed')}>
            <DialogTrigger asChild>
                <Button type="button" size="icon" variant="outline" className="shrink-0 h-12 w-12 rounded-full" disabled={isPending || isVoiceMode}>
                    <Camera className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className={dialogMode === 'camera' ? 'max-w-3xl' : 'sm:max-w-[425px]'}>
              {dialogMode === 'picker' && (
                <>
                  <DialogHeader>
                    <DialogTitle>Add an Image</DialogTitle>
                  </DialogHeader>
                  <div className='grid grid-cols-2 gap-4'>
                      <Button variant="outline" size="lg" className="h-24 flex-col" onClick={() => setDialogMode('camera')}>
                          <Video className='h-8 w-8 mb-2'/>
                          Take Photo with Camera
                      </Button>
                      <Button variant="outline" size="lg" className="h-24 flex-col" onClick={() => fileInputRef.current?.click()}>
                          <Upload className='h-8 w-8 mb-2'/>
                          Upload from Library
                      </Button>
                  </div>
                </>
              )}
              {dialogMode === 'camera' && (
                <>
                  <DialogHeader>
                      <DialogTitle>Camera Capture</DialogTitle>
                  </DialogHeader>
                  <CameraCapture onPhotoTaken={handlePhotoTaken} />
                </>
              )}
            </DialogContent>
          </Dialog>

          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isVoiceMode ? "Listening..." : "Ask or take a photo..."}
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
          </div>
        </form>
         <div className="hidden md:flex justify-center items-center gap-2 border-t mt-3 pt-3">
             <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => (ref as React.RefObject<ChatInterfaceHandle>)?.current?.triggerAction('pests', language)}>
                <Bug className="h-4 w-4 mr-2 text-primary/80"/>
                Pests & Diseases
             </Button>
             <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={onWeatherClick}>
                <CloudSun className="h-4 w-4 mr-2 text-primary/80"/>
                Weather
             </Button>
             <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => (ref as React.RefObject<ChatInterfaceHandle>)?.current?.triggerAction('schemes', language)}>
                <Landmark className="h-4 w-4 mr-2 text-primary/80"/>
                Govt. Schemes
             </Button>
        </div>
      </div>
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';
export default ChatInterface;
