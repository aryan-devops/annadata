
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, ThermometerSun, Wind, Droplets, Lightbulb, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CropCard from './crop-card';
import VoiceReadoutButton from './voice-readout-button';
import { useLanguage } from '@/context/language-context';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { collection } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Crop } from '@/lib/types';

const translations = {
  location: { en: 'Your Location', hi: 'आपका स्थान', mr: 'तुमचे स्थान', ta: 'உங்கள் இடம்', te: 'మీ స్థానం', bn: 'আপনার অবস্থান' },
  detecting: { en: 'Detecting location...', hi: 'स्थान का पता लगाया जा रहा है...', mr: 'स्थान शोधत आहे...', ta: 'இருப்பிடம் கண்டறியப்படுகிறது...', te: 'స్థానాన్ని గుర్తిస్తోంది...', bn: 'অবস্থান সনাক্ত করা হচ্ছে...' },
  manualLocation: { en: 'Or enter manually (e.g., Pune, Maharashtra)', hi: 'या मैन्युअल रूप से दर्ज करें (जैसे, पुणे, महाराष्ट्र)', mr: 'किंवा व्यक्तिचलितपणे प्रविष्ट करा (उदा. पुणे, महाराष्ट्र)', ta: 'அல்லது கைமுறையாக உள்ளிடவும் (எ.கா., புனே, மகாராஷ்டிரா)', te: 'లేదా మానవీయంగా నమోదు చేయండి (ఉదా., పూణే, మహారాష్ట్ర)', bn: 'অথবা ম্যানুয়ালি প্রবেশ করুন (যেমন, পুনে, মহারাষ্ট্র)' },
  setLocation: { en: 'Set', hi: 'सेट करें', mr: 'सेट करा', ta: 'அமை', te: 'సెట్ చేయి', bn: 'সেট করুন' },
  dailyTip: { en: "Today's Tip", hi: 'आज का सुझाव', mr: 'आजची टीप', ta: 'இன்றைய குறிப்பு', te: 'ఈ రోజు చిట్కా', bn: 'আজকের টিপ' },
  cropRecommendations: { en: 'Crop Recommendations', hi: 'फसल सुझाव', mr: 'पीक शिफारसी', ta: 'பயிர் பரிந்துரைகள்', te: 'పంట సిఫార్సులు', bn: 'ফসলের সুপারিশ' },
  currentWeather: { en: 'Current Weather', hi: 'वर्तमान मौसम', mr: 'सध्याचे हवामान', ta: 'தற்போதைய வானிலை', te: 'ప్రస్తుత వాతావరణం', bn: 'বর্তমান আবহাওয়া' },
  feelsLike: { en: 'Feels like', hi: 'जैसा लगता है', mr: 'असे वाटते', ta: 'உணர்வது போல்', te: 'అనిపిస్తుంది', bn: 'অনুভব হচ্ছে' },
  wind: { en: 'Wind', hi: 'हवा', mr: 'वारा', ta: 'காற்று', te: 'గాలి', bn: 'বায়ু' },
  humidity: { en: 'Humidity', hi: 'नमी', mr: 'आर्द्रता', ta: 'ஈரப்பதம்', te: 'తేమ', bn: 'আর্দ্রতা' },
  enterLocationPrompt: { en: 'Enter a location to see the weather.', hi: 'मौसम देखने के लिए एक स्थान दर्ज करें।', mr: 'हवामान पाहण्यासाठी स्थान प्रविष्ट करा.', ta: 'வானிலையைப் பார்க்க ஒரு இடத்தைப் உள்ளிடவும்.', te: 'వాతావరణం చూడటానికి ఒక స్థానాన్ని నమోదు చేయండి.', bn: 'আবহাওয়া দেখতে একটি অবস্থান লিখুন।' },
  couldNotDetectLocation: { en: 'Your location could not be automatically detected. Please enter it manually.', hi: 'आपके स्थान का स्वचालित रूप से पता नहीं लगाया जा सका। कृपया इसे मैन्युअल रूप से दर्ज करें।', mr: 'तुमचे स्थान आपोआप शोधले जाऊ शकले नाही. कृपया ते व्यक्तिचलितपणे प्रविष्ट करा.', ta: 'உங்கள் இருப்பிடத்தை தானாக கண்டறிய முடியவில்லை. தயவுசெய்து அதை கைமுறையாக உள்ளிடவும்.', te: 'మీ స్థానం స్వయంచాలకంగా గుర్తించబడలేదు. దయచేసి దాన్ని మాన్యువల్‌గా నమోదు చేయండి.', bn: 'আপনার অবস্থান স্বয়ংক্রিয়ভাবে সনাক্ত করা যায়নি। অনুগ্রহ করে এটি ম্যানুয়ালি প্রবেশ করান।' },
};

export default function Dashboard() {
  const [location, setLocation] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [weather, setWeather] = useState<any>(null);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const { t } = useLanguage();

  const firestore = useFirestore();
  const cropsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'crops'): null, [firestore]);
  const { data: crops, isLoading: isLoadingCrops, error: cropsError } = useCollection<Crop>(cropsCollectionRef);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude},${longitude}`);
        setIsLoadingLocation(false);
      },
      () => {
        setIsLoadingLocation(false);
      },
      { timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (location) {
      const fetchWeather = async () => {
        setIsFetchingWeather(true);
        setWeatherError(null);
        setWeather(null);
        try {
          const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
          if (!apiKey) {
            setWeatherError("Weather API key is not configured.");
            return;
          }
          const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData?.error?.message || 'Failed to fetch weather data.');
          }
          const data = await res.json();
          setWeather(data);
        } catch (error) {
          console.error(error);
          if (error instanceof Error) {
            setWeatherError(error.message);
          } else {
            setWeatherError('An unknown error occurred.');
          }
        } finally {
          setIsFetchingWeather(false);
        }
      };
      fetchWeather();
    }
  }, [location]);

  const handleManualLocation = () => {
    if (manualLocation.trim()) {
      setLocation(manualLocation.trim());
    }
  };
  
  const dailyTipText = t({
      en: "Check soil moisture before irrigating your crops to avoid overwatering.",
      hi: "पानी की अधिकता से बचने के लिए अपनी फसलों की सिंचाई करने से पहले मिट्टी की नमी की जाँच करें।",
      mr: "जास्त पाणी देणे टाळण्यासाठी आपल्या पिकांना पाणी देण्यापूर्वी जमिनीतील ओलावा तपासा.",
      ta: "அதிக நீர் பாய்ச்சுவதைத் தவிர்க்க, உங்கள் பயிர்களுக்கு நீர்ப்பாசனம் செய்வதற்கு முன் மண்ணின் ஈரப்பதத்தைச் சரிபார்க்கவும்.",
      te: "అధిక నీటిపారుదలని నివారించడానికి మీ పంటలకు నీటిపారుదల చేసే ముందు నేల తేమను తనిఖీ చేయండి.",
      bn: "অতিরিক্ত জল দেওয়া এড়াতে আপনার ফসলে জল দেওয়ার আগে মাটির আর্দ্রতা পরীক্ষা করুন।",
  });

  return (
    <div className="space-y-8">
      {/* Location Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="text-primary" />
            {t(translations.location)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLocation ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t(translations.detecting)}</span>
            </div>
          ) : weather ? (
            <p className="text-lg font-semibold">{weather.location.name}, {weather.location.country}</p>
          ) : (
             <div className="flex w-full max-w-sm flex-col items-start space-y-2">
                <div className="flex w-full items-center space-x-2">
                    <Input
                        type="text"
                        placeholder={t(translations.manualLocation)}
                        value={manualLocation}
                        onChange={(e) => setManualLocation(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleManualLocation()}
                    />
                    <Button onClick={handleManualLocation}>{t(translations.setLocation)}</Button>
                </div>
                {!location && <p className="text-sm text-muted-foreground">{t(translations.couldNotDetectLocation)}</p>}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Daily Tip and Weather */}
        <div className="space-y-8 md:col-span-1">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-accent" />
                {t(translations.dailyTip)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{dailyTipText}</p>
              <VoiceReadoutButton textToRead={dailyTipText} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t(translations.currentWeather)}</CardTitle>
              {weather && <CardDescription>{weather.location.name}, {weather.location.country}</CardDescription>}
            </CardHeader>
            <CardContent>
              {isFetchingWeather && (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {weatherError && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{weatherError}</AlertDescription>
                </Alert>
              )}
              {weather && (
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex items-center">
                    <Image src={`https:${weather.current.condition.icon}`} alt={weather.current.condition.text} width={64} height={64} />
                    <div className="text-5xl font-bold">{Math.round(weather.current.temp_c)}°C</div>
                  </div>
                  <p className="font-semibold text-lg">{weather.current.condition.text}</p>
                  <div className="w-full grid grid-cols-3 gap-2 text-sm text-muted-foreground pt-4 border-t">
                      <div className="flex flex-col items-center gap-1">
                          <ThermometerSun className="h-5 w-5 text-muted-foreground" />
                          <span className="text-xs">{t(translations.feelsLike)}</span>
                          <b className="font-bold text-foreground">{Math.round(weather.current.feelslike_c)}°C</b>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                          <Wind className="h-5 w-5 text-muted-foreground" />
                          <span className="text-xs">{t(translations.wind)}</span>
                          <b className="font-bold text-foreground">{weather.current.wind_kph} km/h</b>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                          <Droplets className="h-5 w-5 text-muted-foreground" />
                          <span className="text-xs">{t(translations.humidity)}</span>
                          <b className="font-bold text-foreground">{weather.current.humidity}%</b>
                      </div>
                  </div>
                </div>
              )}
              {!location && !isFetchingWeather && !weatherError && (
                <p className="py-8 text-center text-muted-foreground">{t(translations.enterLocationPrompt)}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Crop Recommendations */}
        <div className="md:col-span-2">
          <Card>
             <CardHeader>
              <CardTitle>{t(translations.cropRecommendations)}</CardTitle>
              <CardDescription>Based on your location and current season.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {isLoadingCrops && <div className="col-span-full flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>}
              {cropsError && <p className="col-span-full text-destructive">Error loading crops.</p>}
              {crops?.filter(c => c.isVisible).map(crop => (
                <CropCard key={crop.id} crop={crop} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
