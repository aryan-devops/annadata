'use client';
import { useState, useEffect, type ReactNode } from 'react';
import { useLanguage } from '@/context/language-context';
import { translate } from '@/ai/flows/translate-flow';
import { Skeleton } from '@/components/ui/skeleton';

interface DynamicTextProps {
  english: string;
  hindi?: string;
  skeletonClassName?: string;
  children?: (translatedText: string | null) => ReactNode;
}

export function DynamicText({ english, hindi, skeletonClassName = 'h-5 w-24', children }: DynamicTextProps) {
    const { language } = useLanguage();
    const [translatedText, setTranslatedText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!english) {
            setTranslatedText('');
            return;
        }
        if (language === 'en') {
            setTranslatedText(english);
            return;
        }
        if (language === 'hi' && hindi) {
            setTranslatedText(hindi);
            return;
        }
        let isCancelled = false;
        const translateText = async () => {
            setIsLoading(true);
            setTranslatedText(null);
            try {
                const result = await translate({ text: english, targetLanguage: language });
                if (!isCancelled) setTranslatedText(result.translatedText);
            } catch (error) {
                console.error('Translation failed:', error);
                if (!isCancelled) setTranslatedText(english); // Fallback
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        };
        translateText();
        return () => { isCancelled = true; };
    }, [english, hindi, language]);

    if (isLoading) return <Skeleton className={skeletonClassName} />;
    
    const textToShow = translatedText || english;

    if (typeof children === 'function') {
        return children(textToShow);
    }
    
    return <>{textToShow}</>;
}
