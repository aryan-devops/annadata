
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { MapPin, ThermometerSun, Wind, Droplets, Lightbulb, CalendarDays, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CropCard from './crop-card';
import VoiceReadoutButton from './voice-readout-button';
import { useLanguage } from '@/context/language-context';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { collection } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Crop, State } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { locationData, statesList } from '@/lib/location-data';
import { Skeleton } from '@/components/ui/skeleton';

const translations = {
  location: { en: 'Your Location', hi: 'आपका स्थान', mr: 'तुमचे स्थान', ta: 'உங்கள் இடம்', te: 'మీ స్థానం', bn: 'আপনার অবস্থান' },
  detecting: { en: 'Detecting location...', hi: 'स्थान का पता लगाया जा रहा है...', mr: 'स्थान शोधत आहे...', ta: 'இருப்பிடம் கண்டறியப்படுகிறது...', te: 'స్థానాన్ని గుర్తిస్తోంది...', bn: 'অবস্থান সনাক্ত করা হচ্ছে...' },
  manualLocation: { en: 'Set Location Manually', hi: 'मैन्युअल रूप से स्थान सेट करें', mr: 'व्यक्तिचलितपणे स्थान सेट करा', ta: 'இருப்பிடத்தை கைமுறையாக அமைக்கவும்', te: 'మానవీయంగా స్థానాన్ని సెట్ చేయండి', bn: 'ম্যানুয়ালি অবস্থান সেট করুন' },
  changeLocation: { en: 'Change Location', hi: 'स्थान बदलें', mr: 'स्थान बदला', ta: 'இருப்பிடத்தை மாற்றவும்', te: 'స్థానాన్ని మార్చండి', bn: 'অবস্থান পরিবর্তন করুন' },
  setLocation: { en: 'Set Location', hi: 'स्थान सेट करें', mr: 'स्थान सेट करा', ta: 'இடத்தை அமை', te: 'స్థానాన్ని సెట్ చేయి', bn: 'অবস্থান সেট করুন' },
  dailyTip: { en: "Today's Tip", hi: 'आज का सुझाव', mr: 'आजची टीप', ta: 'இன்றைய குறிப்பு', te: 'ఈ రోజు చిట్కా', bn: 'আজকের টিপ' },
  cropRecommendations: { en: 'Crop Recommendations', hi: 'फसल सुझाव', mr: 'पीक शिफारसी', ta: 'பயிர் பரிந்துரைகள்', te: 'పంట సిఫార్సులు', bn: 'ফসলের সুপারিশ' },
  currentWeather: { en: 'Current Weather', hi: 'वर्तमान मौसम', mr: 'सध्याचे हवामान', ta: 'தற்போதைய வானிலை', te: 'ప్రస్తుత వాతావరణం', bn: 'বর্তমান আবহাওয়া' },
  feelsLike: { en: 'Feels like', hi: 'जैसा लगता है', mr: 'असे वाटते', ta: 'உணர்வது போல்', te: 'అనిపిస్తుంది', bn: 'অনুভব হচ্ছে' },
  wind: { en: 'Wind', hi: 'हवा', mr: 'वारा', ta: 'காற்று', te: 'గాలి', bn: 'বায়ু' },
  humidity: { en: 'Humidity', hi: 'नमी', mr: 'आर्द्रता', ta: 'ஈரப்பதம்', te: 'తేమ', bn: 'আর্দ্রতা' },
  enterLocationPrompt: { en: 'Enter a location to see the weather.', hi: 'मौसम देखने के लिए एक स्थान दर्ज करें।', mr: 'हवामान पाहण्यासाठी स्थान प्रविष्ट करा.', ta: 'வானிலையைப் பார்க்க ஒரு இடத்தைப் உள்ளிடவும்.', te: 'వాతావరణం చూడటానికి ఒక స్థానాన్ని నమోదు చేయండి.', bn: 'আবহাওয়া দেখতে একটি অবস্থান লিখুন।' },
  couldNotDetectLocation: { en: 'Your location could not be automatically detected. Please enter it manually.', hi: 'आपके स्थान का स्वचालित रूप से पता नहीं लगाया जा सका। कृपया इसे मैन्युअल रूप से दर्ज करें।', mr: 'तुमचे स्थान आपोआप शोधले जाऊ शकले नाही. कृपया ते व्यक्तिचलितपणे प्रविष्ट करा.', ta: 'உங்கள் இருப்பிடத்தை தானாக கண்டறிய முடியவில்லை. தயவுசெய்து அதை கைமுறையாக உள்ளிடவும்.', te: 'మీ స్థానం స్వయంచాలకంగా గుర్తించబడలేదు. దయచేసి దాన్ని మాన్యువల్‌గా నమోదు చేయండి.', bn: 'আপনার অবস্থান স্বয়ংক্রিয়ভাবে সনাক্ত করা যায়নি। অনুগ্রহ করে এটি ম্যানুয়ালি প্রবেশ করান।' },
  basedOnSeason: { en: 'Based on the current season', hi: 'वर्तमान मौसम के आधार पर', mr: 'सध्याच्या हंगामावर आधारित', ta: 'தற்போதைய பருவத்தின் அடிப்படையில்', te: 'ప్రస్తుత సీజన్ ఆధారంగా', bn: 'বর্তমান মৌসুমের উপর ভিত্তি করে' },
  filterBySoil: { en: 'Filter by soil type...', hi: 'मिट्टी के प्रकार से फ़िल्टर करें...', mr: 'मातीच्या प्रकारानुसार फिल्टर करा...', ta: 'மண் வகையின்படி வடிகட்டவும்...', te: 'నేల రకం ద్వారా ఫిల్టర్ చేయండి...', bn: 'মাটির ধরন অনুসারে ফিল্টার করুন...' },
  allSoils: { en: 'All Soil Types', hi: 'सभी मिट्टी के प्रकार', mr: 'सर्व मातीचे प्रकार', ta: 'அனைத்து மண் வகைகள்', te: 'అన్ని నేల రకాలు', bn: 'সমস্ত মাটির প্রকার' },
};

const seasonDefinitions = [
    { id: 'kharif', name: 'Kharif', startMonth: 5, endMonth: 9 }, // June to Oct (0-indexed months)
    { id: 'rabi', name: 'Rabi', startMonth: 10, endMonth: 2 }, // Nov to Mar
    { id: 'zaid', name: 'Zaid', startMonth: 3, endMonth: 4 }, // Apr to May
];

const soilTypes = [ 'All', 'Loamy', 'Clayey Loam', 'Red Loam', 'Heavy Loam', 'Black Cotton Soil', 'Sandy Loam', 'Light to Heavy Clay' ];

function getCurrentSeason() {
    const currentMonth = new Date().getMonth();
    for (const season of seasonDefinitions) {
        if (season.startMonth <= season.endMonth) {
            if (currentMonth >= season.startMonth && currentMonth <= season.endMonth) {
                return season;
            }
        } else {
            if (currentMonth >= season.startMonth || currentMonth <= season.endMonth) {
                return season;
            }
        }
    }
    return null;
}

const WeatherSkeleton = () => (
  <div className="flex flex-col items-center space-y-4 text-center">
    <div className="flex items-center">
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="h-12 w-24 ml-2" />
    </div>
    <Skeleton className="h-6 w-32" />
    <div className="w-full grid grid-cols-3 gap-2 text-sm text-muted-foreground pt-4 border-t">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-12 mt-1" />
              <Skeleton className="h-5 w-16 mt-1" />
          </div>
        ))}
    </div>
  </div>
);

const CropCardSkeleton = () => (
  <Card className="flex flex-col overflow-hidden">
    <CardHeader className="p-0">
      <Skeleton className="h-48 w-full" />
    </CardHeader>
    <CardContent className="flex-grow p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

export default function Dashboard() {
  const [location, setLocation] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [weather, setWeather] = useState<any>(null);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [selectedSoilType, setSelectedSoilType] = useState('All');
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string>('');
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const { t } = useLanguage();
  const currentSeasonInfo = useMemo(getCurrentSeason, []);

  const firestore = useFirestore();
  const cropsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'crops'): null, [firestore]);
  const { data: crops, isLoading: isLoadingCrops, error: cropsError } = useCollection<Crop>(cropsCollectionRef);
  const statesCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'states') : null, [firestore]);
  const { data: states } = useCollection<State>(statesCollectionRef);

  const recommendedCrops = useMemo(() => {
    if (!crops || !currentSeasonInfo || !states) return [];
    
    const currentStateName = weather?.location?.region;
    const selectedStateObj = states.find(s => s.name === currentStateName);
    const selectedStateId = selectedStateObj?.id;

    let filteredCrops = crops.filter(crop =>
        crop.isVisible && crop.suitableSeasonIds.includes(currentSeasonInfo.id)
    );

    if (selectedStateId) {
        filteredCrops = filteredCrops.filter(crop => crop.supportedStateIds.includes(selectedStateId));
    }

    if (selectedSoilType && selectedSoilType !== 'All') {
        filteredCrops = filteredCrops.filter(crop => crop.soilType === selectedSoilType);
    }
    
    return filteredCrops;
  }, [crops, currentSeasonInfo, selectedSoilType, weather, states]);

  useEffect(() => {
    if (selectedState) {
      setAvailableDistricts(locationData[selectedState as keyof typeof locationData] || []);
      setSelectedDistrict('');
    } else {
      setAvailableDistricts([]);
    }
  }, [selectedState]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude},${longitude}`);
        setIsLoadingLocation(false);
      },
      () => {
        setIsLoadingLocation(false);
        // Don't open dialog automatically, let user click button
        // setIsLocationDialogOpen(true);
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

  const handleSetManualLocation = () => {
    if (selectedState && selectedDistrict) {
      setLocation(`${selectedDistrict}, ${selectedState}`);
      setIsLocationDialogOpen(false);
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
    <>
    <div className="space-y-8">
      {/* Location Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="text-primary" />
            {t(translations.location)}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-grow">
                {isLoadingLocation ? (
                <div className="flex items-center space-x-2 text-muted-foreground">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-48" />
                </div>
                ) : weather ? (
                <p className="text-lg font-semibold">{weather.location.name}, {weather.location.region}, {weather.location.country}</p>
                ) : (
                    <p className="text-muted-foreground">{t(translations.couldNotDetectLocation)}</p>
                )}
            </div>
            <Button onClick={() => setIsLocationDialogOpen(true)} variant="outline" className="w-full sm:w-auto flex-shrink-0">
                <Edit className="mr-2 h-4 w-4" />
                {weather ? t(translations.changeLocation) : t(translations.manualLocation)}
            </Button>
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
              {isFetchingWeather ? (
                <WeatherSkeleton />
              ) : weatherError ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{weatherError}</AlertDescription>
                </Alert>
              ) : weather ? (
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex items-center">
                    <Image src={`https:${weather.current.condition.icon}`} alt={weather.current.condition.text} width={64} height={64} unoptimized />
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
              ) : (
                <p className="py-8 text-center text-muted-foreground">{t(translations.enterLocationPrompt)}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Crop Recommendations */}
        <div className="md:col-span-2">
          <Card>
             <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle>{t(translations.cropRecommendations)}</CardTitle>
                        {currentSeasonInfo ? (
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>{t(translations.basedOnSeason)}: <span className="font-semibold text-primary">{currentSeasonInfo.name}</span> { weather?.location?.region && <>in <span className="font-semibold text-primary">{weather.location.region}</span></>}</span>
                                </CardDescription>
                            ) : (
                                <CardDescription>Based on your location and current season.</CardDescription>
                            )}
                    </div>
                     <div className="w-full sm:w-48">
                        <Select value={selectedSoilType} onValueChange={setSelectedSoilType}>
                            <SelectTrigger id="soil-type-filter" className="w-full">
                                <SelectValue placeholder={t(translations.filterBySoil)} />
                            </SelectTrigger>
                            <SelectContent>
                                {soilTypes.map(soil => (
                                    <SelectItem key={soil} value={soil}>{soil === 'All' ? t(translations.allSoils) : soil}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {isLoadingCrops ? (
                  [...Array(4)].map((_, i) => <CropCardSkeleton key={i} />)
              ) : cropsError ? (
                  <p className="col-span-full text-destructive">Error loading crops.</p>
              ) : recommendedCrops.length > 0 ? (
                  recommendedCrops.map(crop => <CropCard key={crop.id} crop={crop} />)
              ) : (
                 <div className="col-span-full text-center text-muted-foreground py-16">
                    <p>No recommended crops found for the selected criteria this season.</p>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Your Location</DialogTitle>
          <DialogDescription>
            Choose your state and district to get tailored weather and crop recommendations.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="state-select">State</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger id="state-select">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {statesList.map(stateName => (
                  <SelectItem key={stateName} value={stateName}>{stateName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="district-select">District</Label>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedState}>
              <SelectTrigger id="district-select">
                <SelectValue placeholder="Select a district" />
              </SelectTrigger>
              <SelectContent>
                {availableDistricts.map(districtName => (
                  <SelectItem key={districtName} value={districtName}>{districtName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsLocationDialogOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSetManualLocation} disabled={!selectedDistrict || !selectedState}>
            {t(translations.setLocation)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

    