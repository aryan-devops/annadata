"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, CloudRain, ThermometerSun, Snowflake, Lightbulb, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CropCard from './crop-card';
import VoiceReadoutButton from './voice-readout-button';
import { crops, weatherAlerts, dailyTips } from '@/lib/data';
import { useLanguage } from '@/context/language-context';

const translations = {
  location: { en: 'Your Location', hi: 'आपका स्थान', mr: 'तुमचे स्थान', ta: 'உங்கள் இடம்', te: 'మీ స్థానం', bn: 'আপনার অবস্থান' },
  detecting: { en: 'Detecting location...', hi: 'स्थान का पता लगाया जा रहा है...', mr: 'स्थान शोधत आहे...', ta: 'இருப்பிடம் கண்டறியப்படுகிறது...', te: 'స్థానాన్ని గుర్తిస్తోంది...', bn: 'অবস্থান সনাক্ত করা হচ্ছে...' },
  manualLocation: { en: 'Or enter manually (e.g., Pune, Maharashtra)', hi: 'या मैन्युअल रूप से दर्ज करें (जैसे, पुणे, महाराष्ट्र)', mr: 'किंवा व्यक्तिचलितपणे प्रविष्ट करा (उदा. पुणे, महाराष्ट्र)', ta: 'அல்லது கைமுறையாக உள்ளிடவும் (எ.கா., புனே, மகாராஷ்டிரா)', te: 'లేదా మానవీయంగా నమోదు చేయండి (ఉదా., పూణే, మహారాష్ట్ర)', bn: 'অথবা ম্যানুয়ালি প্রবেশ করুন (যেমন, পুনে, মহারাষ্ট্র)' },
  setLocation: { en: 'Set', hi: 'सेट करें', mr: 'सेट करा', ta: 'அமை', te: 'సెట్ చేయి', bn: 'সেট করুন' },
  dailyTip: { en: "Today's Tip", hi: 'आज का सुझाव', mr: 'आजची टीप', ta: 'இன்றைய குறிப்பு', te: 'ఈ రోజు చిట్కా', bn: 'আজকের টিপ' },
  weatherAlerts: { en: 'Weather Alerts', hi: 'मौसम अलर्ट', mr: ' हवामान सूचना', ta: 'வானிலை எச்சரிக்கைகள்', te: 'వాతావరణ హెచ్చరికలు', bn: 'আবহাওয়ার সতর্কতা' },
  cropRecommendations: { en: 'Crop Recommendations', hi: 'फसल सुझाव', mr: 'पीक शिफारसी', ta: 'பயிர் பரிந்துரைகள்', te: 'పంట సిఫార్సులు', bn: 'ফসলের সুপারিশ' },
};

export default function Dashboard() {
  const [location, setLocation] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, we'd use position.coords.latitude and position.coords.longitude
        // to get a location name via a reverse geocoding API.
        // For this demo, we'll just set a mock location.
        setLocation('Pune, Maharashtra');
        setIsLoadingLocation(false);
      },
      () => {
        // Handle error or user denial
        setIsLoadingLocation(false);
        setLocation(null); // Fallback to manual input
      },
      { timeout: 10000 }
    );
  }, []);

  const handleManualLocation = () => {
    if (manualLocation.trim()) {
      setLocation(manualLocation.trim());
    }
  };
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'rain': return <CloudRain className="h-4 w-4" />;
      case 'heatwave': return <ThermometerSun className="h-4 w-4" />;
      case 'frost': return <Snowflake className="h-4 w-4" />;
      default: return null;
    }
  };

  const dailyTip = dailyTips[0];

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
          ) : location ? (
            <p className="text-lg font-semibold">{location}</p>
          ) : (
             <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder={t(translations.manualLocation)}
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
              />
              <Button onClick={handleManualLocation}>{t(translations.setLocation)}</Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Daily Tip and Weather Alerts */}
        <div className="space-y-8 md:col-span-1">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-accent" />
                {t(translations.dailyTip)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{t(dailyTip.tip)}</p>
              <VoiceReadoutButton textToRead={t(dailyTip.tip)} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t(translations.weatherAlerts)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {weatherAlerts.map(alert => (
                 <Alert key={alert.id} variant={alert.type === 'heatwave' ? 'destructive' : 'default'}>
                  {getAlertIcon(alert.type)}
                  <AlertTitle>{t(alert.title)}</AlertTitle>
                  <AlertDescription>{t(alert.message)}</AlertDescription>
                </Alert>
              ))}
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
              {crops.map(crop => (
                <CropCard key={crop.id} crop={crop} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
