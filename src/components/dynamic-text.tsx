'use client';
import { type ReactNode } from 'react';
import { useLanguage } from '@/context/language-context';

interface DynamicTextProps {
  english: string;
  hindi?: string;
  children?: (translatedText: string) => ReactNode;
}

export function DynamicText({ english, hindi, children }: DynamicTextProps) {
    const { language } = useLanguage();
    
    // Default to English if language is not 'hi' or if hindi text isn't provided
    const textToShow = (language === 'hi' && hindi) ? hindi : english;

    // If a render prop is provided, call it with the selected text
    if (typeof children === 'function') {
        return children(textToShow);
    }
    
    // Otherwise, just render the text
    return <>{textToShow}</>;
}
