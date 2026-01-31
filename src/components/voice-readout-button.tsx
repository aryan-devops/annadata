"use client";

import { useState, useEffect } from 'react';
import { Volume2, Loader2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';

interface VoiceReadoutButtonProps {
  textToRead: string;
}

const langToLocale: { [key: string]: string } = {
  en: 'en-US',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
};

export default function VoiceReadoutButton({ textToRead }: VoiceReadoutButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    
    const handleSpeechEnd = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.addEventListener('end', handleSpeechEnd);
    return () => {
      window.speechSynthesis.removeEventListener('end', handleSpeechEnd);
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!isSupported) return;

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = langToLocale[language] || 'en-US';
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return null;
  }

  const getIcon = () => {
    if (isSpeaking && !isPaused) return <Pause className="h-4 w-4" />;
    if (isSpeaking && isPaused) return <Play className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <Button onClick={handleSpeak} variant="outline" size="sm">
      {getIcon()}
      <span className="sr-only">Read aloud</span>
    </Button>
  );
}
