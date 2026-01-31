export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn';

export type Translations = {
  [key: string]: string;
};

export interface Crop {
  id: string;
  nameEnglish: string;
  nameLocal: string;
  imageUrl: string;
  supportedStateIds: string[];
  suitableSeasonIds: string[];
  soilType: string;
  idealTemperature: string;
  idealRainfall: string;
  expectedYield: number;
  approximateMarketPrice: number;
  isVisible: boolean;
}

export type WeatherAlert = {
    id: string;
    thresholdRain: number;
    thresholdTemperatureMin: number;
    thresholdTemperatureMax: number;
    frostRisk: boolean;
    alertMessage: string;
    recommendedActions: string;
    isEnabled: boolean;
};

export type FarmingTip = {
    id: string;
    tipText: string;
    language: string;
    scheduledDate: string; // ISO string
    isEnabled: boolean;
};

export interface CropLifecycle {
  id: string;
  cropId: string;
  sowingDateRange: string;
  seedRate: string;
  fertilizerBasalDose: string;
  fertilizerTopDressing: string;
  diseasePesticideGuide: string;
  irrigationSchedule: string;
  harvestingWindow: string;
  harvestingReadinessSigns: string;
}
