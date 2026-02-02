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
      
      // For a "sweeter" voice, we can slightly increase the pitch and slow down the rate.
      utterance.pitch = 1.1; 
      utterance.rate = 0.9;

      let voiceToUse: SpeechSynthesisVoice | undefined;
      const langPrefix = language;

      // 1. Get all female voices for the current language.
      const femaleVoices = voices.filter(
        (voice) => voice.lang.startsWith(langPrefix) && /female/i.test(voice.name)
      );

      // 2. Prioritize "Google" voices as they are often higher quality.
      voiceToUse = femaleVoices.find(v => /google/i.test(v.name));

      // 3. If no Google voice, take the first available female voice.
      if (!voiceToUse) {
        voiceToUse = femaleVoices[0];
      }
      
      // 4. If still no voice, fallback to any voice that isn't explicitly male.
      if (!voiceToUse) {
         voiceToUse = voices.find(
            (voice) => voice.lang.startsWith(langPrefix) && !/male/i.test(voice.name)
         );
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
