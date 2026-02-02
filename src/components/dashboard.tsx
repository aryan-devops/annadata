
"use client";

import React, { useState, useEffect, useMemo, type ReactNode } from 'react';
import Image from 'next/image';
import { MapPin, ThermometerSun, Wind, Droplets, Lightbulb, CalendarDays, Edit, AlertTriangle, CloudRain, Sun, Snowflake, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CropCard from './crop-card';
import VoiceReadoutButton from './voice-readout-button';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { collection } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Crop, State, FarmingTip, WeatherAlert as WeatherAlertType } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { locationData, statesList } from '@/lib/location-data';
import { Skeleton } from '@/components/ui/skeleton';
import { DynamicText } from './dynamic-text';

const seasonDefinitions = [
    { id: 'kharif', name: 'Kharif', startMonth: 5, endMonth: 9 }, // June to Oct (0-indexed months)
    { id: 'rabi', name: 'Rabi', startMonth: 10, endMonth: 2 }, // Nov to Mar
    { id: 'zaid', name: 'Zaid', startMonth: 3, endMonth: 4 }, // Apr to May
];

const soilTypes = ['All', 'Loamy', 'Clayey Loam', 'Red Loam', 'Heavy Loam', 'Black Cotton Soil', 'Sandy Loam', 'Clay', 'Loamy Sand', 'Well-drained Sandy Loam', 'Light to Heavy Clay'];

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
      <Skeleton className="relative h-48 w-full" />
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
  const currentSeasonInfo = useMemo(getCurrentSeason, []);

  const firestore = useFirestore();
  const cropsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'crops'): null, [firestore]);
  const statesCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'states') : null, [firestore]);
  const farmingTipsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'farmingTips') : null, [firestore]);
  const weatherAlertsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'weatherAlerts') : null, [firestore]);

  const { data: crops, isLoading: isLoadingCrops, error: cropsError } = useCollection<Crop>(cropsCollectionRef);
  const { data: states } = useCollection<State>(statesCollectionRef);
  const { data: farmingTips, isLoading: isLoadingTips } = useCollection<FarmingTip>(farmingTipsCollectionRef);
  const { data: weatherAlerts } = useCollection<WeatherAlertType>(weatherAlertsCollectionRef);

  const activeAlert = useMemo(() => {
    if (!weather?.forecast || !weatherAlerts) return null;

    const triggered: any[] = [];
    const forecast = weather.forecast.forecastday;

    for (const rule of weatherAlerts) {
        if (!rule.isEnabled) continue;
        
        let isTriggeredThisRule = false;
        for (const day of forecast) {
            const evaluations = [
                (rule.frostRisk === true) ? (day.day.mintemp_c <= 4) : null,
                (rule.thresholdTemperatureMax != null) ? (day.day.maxtemp_c > rule.thresholdTemperatureMax) : null,
                (rule.thresholdTemperatureMin != null) ? (day.day.mintemp_c < rule.thresholdTemperatureMin) : null,
                (rule.thresholdRain != null) ? (day.day.totalprecip_mm > rule.thresholdRain) : null,
                (rule.thresholdWind != null) ? (day.day.maxwind_kph > rule.thresholdWind) : null,
                (rule.thresholdHumidity != null) ? (day.day.avghumidity > rule.thresholdHumidity) : null,
            ];
            
            const definedConditions = evaluations.filter(result => result !== null);

            if (definedConditions.length > 0 && definedConditions.every(result => result === true)) {
                isTriggeredThisRule = true;
                break; 
            }
        }

        if (isTriggeredThisRule) {
            let priority = 4;
            let variant: 'destructive' | 'warning' | 'default' = 'default';
            let icon: React.ElementType = AlertTriangle;

            if (rule.frostRisk || (rule.thresholdTemperatureMax && rule.thresholdTemperatureMax >= 40) || rule.thresholdTemperatureMin) {
                priority = 1;
                variant = 'destructive';
                icon = (rule.frostRisk || rule.thresholdTemperatureMin) ? Snowflake : Sun;
            } else if (rule.thresholdWind) {
                priority = 2;
                variant = 'warning';
            } else if (rule.thresholdRain) {
                priority = 3;
                icon = CloudRain;
            }
            
            triggered.push({ ...rule, priority, variant, icon });
        }
    }

    const isDrySpell = forecast.length >= 7 && forecast.every((day:any) => day.day.totalprecip_mm === 0);
    if (isDrySpell) {
        triggered.push({
            id: 'dry-spell',
            priority: 2,
            alertMessage: 'Dry Spell Alert',
            recommendedActions: 'Plan for irrigation and delay fertilizer application as no rain is forecast for the next 7 days.',
            variant: 'warning',
            icon: Sun
        });
    }

    if (triggered.length === 0) {
        return {
            id: 'normal',
            type: 'Normal',
            title: 'Weather is Normal',
            message: 'Current and forecast conditions are suitable for normal farming activities.',
            advice: 'You may continue with sowing, irrigation, and routine field work.',
            variant: 'success',
            icon: CheckCircle2,
        };
    }

    triggered.sort((a, b) => a.priority - b.priority);
    return triggered[0];

  }, [weather, weatherAlerts]);

  const dynamicTip = useMemo(() => {
    if (!farmingTips || farmingTips.length === 0) return null;

    let possibleTips: FarmingTip[] = [];

    if (weather?.current) {
        const { temp_c, precip_mm, wind_kph, humidity } = weather.current;
        
        if (temp_c > 35) possibleTips.push(...farmingTips.filter(t => t.category === 'hot' && t.isEnabled));
        if (temp_c < 10) possibleTips.push(...farmingTips.filter(t => t.category === 'cold' && t.isEnabled));
        if (precip_mm > 5) possibleTips.push(...farmingTips.filter(t => t.category === 'rainy' && t.isEnabled));
        if (wind_kph > 25) possibleTips.push(...farmingTips.filter(t => t.category === 'windy' && t.isEnabled));
        if (humidity > 85) possibleTips.push(...farmingTips.filter(t => t.category === 'humidity' && t.isEnabled));
    }
    
    if (possibleTips.length === 0) {
        possibleTips = farmingTips.filter(t => t.category === 'general' && t.isEnabled);
    }
    
    if (possibleTips.length === 0) return farmingTips[0] || null;
    
    const randomIndex = Math.floor(Math.random() * possibleTips.length);
    return possibleTips[randomIndex];

  }, [farmingTips, weather]);

  const dailyTipText = dynamicTip?.tipText || "Check soil moisture before irrigating your crops to avoid overwatering.";

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
        filteredCrops = filteredCrops.filter(crop => crop.soilTypes.includes(selectedSoilType));
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
              throw new Error("Weather API key is not configured. Please set NEXT_PUBLIC_WEATHER_API_KEY in your .env.local file or server environment.");
            }
            const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=no&alerts=no`);
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData?.error?.message || 'Failed to fetch weather data.');
            }
            const data = await res.json();
            setWeather(data);
        } catch (error: any) {
            setWeatherError(error.message);
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

  return (
    <>
    <div className="space-y-8 animate-fade-in">
       {/* Smart Weather Alert Section */}
      {activeAlert ? (
          activeAlert.id === 'normal' ? (
            <Alert variant="success">
              <activeAlert.icon className="h-4 w-4" />
              <AlertTitle><DynamicText english={activeAlert.title} /></AlertTitle>
              <AlertDescription>
                <DynamicText english={activeAlert.message} /> <DynamicText english={activeAlert.advice} />
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant={activeAlert.variant}>
              <activeAlert.icon className="h-4 w-4" />
              <AlertTitle><DynamicText english={activeAlert.alertMessage} /></AlertTitle>
              <AlertDescription>
                <DynamicText english={activeAlert.recommendedActions} />
              </AlertDescription>
            </Alert>
          )
      ) : (
        <Skeleton className="h-20 w-full" />
      )}

      {/* Location Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="text-primary" />
            <DynamicText english="Your Location" />
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
                    <p className="text-muted-foreground"><DynamicText english="Your location could not be automatically detected. Please enter it manually." /></p>
                )}
            </div>
            <Button onClick={() => setIsLocationDialogOpen(true)} variant="outline" className="w-full sm:w-auto flex-shrink-0">
                <Edit className="mr-2 h-4 w-4" />
                {weather ? <DynamicText english="Change Location" /> : <DynamicText english="Set Location Manually" />}
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
                <DynamicText english="Today's Tip" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTips ? (
                  <div className='space-y-2'>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                  </div>
              ) : (
                <DynamicText english={dailyTipText}>
                  {(translated) => (
                    <>
                      <p className="mb-4">{translated || dailyTipText}</p>
                      <VoiceReadoutButton textToRead={translated || dailyTipText} />
                    </>
                  )}
                </DynamicText>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle><DynamicText english="Current Weather" /></CardTitle>
              {weather && <CardDescription>{`${weather.location.name}, ${weather.location.country}`}</CardDescription>}
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
                          <span className="text-xs"><DynamicText english="Feels like" /></span>
                          <b className="font-bold text-foreground">{Math.round(weather.current.feelslike_c)}°C</b>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                          <Wind className="h-5 w-5 text-muted-foreground" />
                          <span className="text-xs"><DynamicText english="Wind" /></span>
                          <b className="font-bold text-foreground">{weather.current.wind_kph} km/h</b>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                          <Droplets className="h-5 w-5 text-muted-foreground" />
                          <span className="text-xs"><DynamicText english="Humidity" /></span>
                          <b className="font-bold text-foreground">{weather.current.humidity}%</b>
                      </div>
                  </div>
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground"><DynamicText english="Enter a location to see the weather." /></p>
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
                        <CardTitle><DynamicText english="Crop Recommendations" /></CardTitle>
                        {currentSeasonInfo ? (
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    <CalendarDays className="h-4 w-4" />
                                    <span><DynamicText english="Based on the current season" />: <span className="font-semibold text-primary">{currentSeasonInfo.name}</span> { weather?.location?.region && <>in <span className="font-semibold text-primary">{weather.location.region}</span></>}</span>
                                </CardDescription>
                            ) : (
                                <CardDescription>Based on your location and current season.</CardDescription>
                            )}
                    </div>
                     <div className="w-full sm:w-48">
                        <Select value={selectedSoilType} onValueChange={setSelectedSoilType}>
                            <SelectTrigger id="soil-type-filter" className="w-full">
                                <SelectValue placeholder={<DynamicText english="Filter by soil type..." />} />
                            </SelectTrigger>
                            <SelectContent>
                                {soilTypes.map(soil => (
                                    <SelectItem key={soil} value={soil}>{soil === 'All' ? <DynamicText english="All Soil Types" /> : soil}</SelectItem>
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
                  recommendedCrops.map((crop, i) => (
                    <div key={crop.id} className="opacity-0 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms`}}>
                      <CropCard crop={crop} />
                    </div>
                  ))
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
          <DialogTitle><DynamicText english="Select Your Location" /></DialogTitle>
          <DialogDescription>
            <DynamicText english="Choose your state and district to get tailored weather and crop recommendations." />
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="state-select"><DynamicText english="State" /></Label>
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
            <Label htmlFor="district-select"><DynamicText english="District" /></Label>
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
          <Button type="button" variant="outline" onClick={() => setIsLocationDialogOpen(false)}><DynamicText english="Cancel" /></Button>
          <Button type="submit" onClick={handleSetManualLocation} disabled={!selectedDistrict || !selectedState}>
            <DynamicText english="Set Location" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
