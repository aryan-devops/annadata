"use client";

import { useState, useEffect } from 'react';
import { Volume2, Play, Pause } from 'lucide-react';
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    const checkSupport = () => {
      const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
      setIsSupported(supported);
      return supported;
    };

    if (checkSupport()) {
      const loadVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
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

      // Find a female voice
      const femaleVoices = voices.filter(
        (voice) => voice.lang.startsWith(language) && /female/i.test(voice.name)
      );
      
      let voiceToUse = femaleVoices[0];

      if (!voiceToUse) {
        // Fallback to any voice for the language that is not explicitly male
         const otherVoices = voices.filter(
            (voice) => voice.lang.startsWith(language) && !/male/i.test(voice.name)
         );
         voiceToUse = otherVoices[0];
      }
      
      if(voiceToUse) {
        utterance.voice = voiceToUse;
      }

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
