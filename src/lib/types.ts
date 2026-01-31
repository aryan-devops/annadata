export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn';

export type Translations = {
  [key: string]: string;
};

export type Crop = {
  id: string;
  name: Translations;
  image: string;
  soilType: Translations;
  temperature: string;
  rainfall: string;
  yieldPerAcre: Translations;
  marketPrice: Translations;
  sowingTime: Translations;
  seedRate: Translations;
  fertilizerSchedule: {
    stage: Translations;
    details: Translations;
  }[];
  pesticideGuide: {
    pest: Translations;
    solution: Translations;
  }[];
  irrigationSchedule: {
    stage: Translations;
    frequency: Translations;
  }[];
  harvestingTime: Translations;
};

export type WeatherAlert = {
  id: string;
  type: 'rain' | 'heatwave' | 'frost';
  title: Translations;
  message: Translations;
};

export type DailyTip = {
  id: string;
  tip: Translations;
};
