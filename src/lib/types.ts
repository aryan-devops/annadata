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
  type: 'rain' | 'heatwave' | 'frost';
  title: Translations;
  message: Translations;
};

export type DailyTip = {
  id: string;
  tip: Translations;
};
