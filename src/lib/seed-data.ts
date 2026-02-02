
import { Crop, WeatherAlert, FarmingTip, CropLifecycle, State, Season } from './types';

export const states: State[] = [
  { id: 'haryana', name: 'Haryana', climateZone: 'Subtropical' },
  { id: 'punjab', name: 'Punjab', climateZone: 'Subtropical' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', climateZone: 'Subtropical' },
  { id: 'west-bengal', name: 'West Bengal', climateZone: 'Tropical' },
  { id: 'andhra-pradesh', name: 'Andhra Pradesh', climateZone: 'Tropical' },
  { id: 'karnataka', name: 'Karnataka', climateZone: 'Tropical' },
  { id: 'maharashtra', name: 'Maharashtra', climateZone: 'Tropical' },
  { id: 'rajasthan', name: 'Rajasthan', climateZone: 'Arid' },
  { id: 'gujarat', name: 'Gujarat', climateZone: 'Arid' },
  { id: 'telangana', name: 'Telangana', climateZone: 'Tropical' },
  { id: 'madhya-pradesh', name: 'Madhya Pradesh', climateZone: 'Subtropical'},
  { id: 'tamil-nadu', name: 'Tamil Nadu', climateZone: 'Tropical' },
  { id: 'kerala', name: 'Kerala', climateZone: 'Tropical' },
  { id: 'bihar', name: 'Bihar', climateZone: 'Subtropical' },
  { id: 'odisha', name: 'Odisha', climateZone: 'Tropical' },
  { id: 'assam', name: 'Assam', climateZone: 'Tropical' },
  { id: 'himachal-pradesh', name: 'Himachal Pradesh', climateZone: 'Temperate' },
  { id: 'jammu-kashmir', name: 'Jammu and Kashmir', climateZone: 'Temperate' },
];

export const seasons: Season[] = [
  {
    id: 'kharif',
    name: 'Kharif',
    startDate: new Date(new Date().getFullYear(), 5, 1).toISOString(),
    endDate: new Date(new Date().getFullYear(), 9, 31).toISOString(),
  },
  {
    id: 'rabi',
    name: 'Rabi',
    startDate: new Date(new Date().getFullYear(), 10, 1).toISOString(),
    endDate: new Date(new Date().getFullYear() + 1, 2, 31).toISOString(),
  },
  {
    id: 'zaid',
    name: 'Zaid',
    startDate: new Date(new Date().getFullYear(), 3, 1).toISOString(),
    endDate: new Date(new Date().getFullYear(), 4, 31).toISOString(),
  },
];


export const crops: Crop[] = [
  {
    id: 'wheat-haryana-rabi',
    nameEnglish: 'Wheat',
    nameLocal: 'गेहूं',
    imageUrl: 'https://images.unsplash.com/photo-1514481043218-e965c5886f06?q=80&w=1080',
    supportedStateIds: ['haryana', 'punjab', 'uttar-pradesh'],
    suitableSeasonIds: ['rabi'],
    soilTypes: ['Loamy'],
    idealTemperature: '15-25°C',
    idealRainfall: '50-90 cm',
    expectedYield: 2000,
    approximateMarketPrice: 2125,
    isVisible: true,
  },
  {
    id: 'rice-westbengal-kharif',
    nameEnglish: 'Rice',
    nameLocal: 'चावल',
    imageUrl: 'https://images.unsplash.com/photo-1599328580087-15c9dab481f3?q=80&w=1080',
    supportedStateIds: ['west-bengal', 'punjab', 'andhra-pradesh', 'bihar', 'odisha'],
    suitableSeasonIds: ['kharif'],
    soilTypes: ['Clayey Loam'],
    idealTemperature: '21-37°C',
    idealRainfall: '150-300 cm',
    expectedYield: 2500,
    approximateMarketPrice: 2040,
    isVisible: true,
  },
  {
    id: 'maize-karnataka-kharif',
    nameEnglish: 'Maize (Corn)',
    nameLocal: 'मक्का',
    imageUrl: 'https://images.unsplash.com/photo-1551810080-3eb3be72d3f4?q=80&w=1080',
    supportedStateIds: ['karnataka', 'maharashtra', 'rajasthan', 'bihar'],
    suitableSeasonIds: ['kharif', 'rabi'],
    soilTypes: ['Red Loam', 'Sandy Loam', 'Clay Loam'],
    idealTemperature: '21-27°C',
    idealRainfall: '50-100 cm',
    expectedYield: 3000,
    approximateMarketPrice: 1962,
    isVisible: true,
  },
  {
    id: 'sugarcane-maharashtra-annual',
    nameEnglish: 'Sugarcane',
    nameLocal: 'गन्ना',
    imageUrl: 'https://images.unsplash.com/photo-1570295289045-885a6b13735b?q=80&w=1080',
    supportedStateIds: ['maharashtra', 'uttar-pradesh', 'karnataka', 'tamil-nadu'],
    suitableSeasonIds: ['kharif', 'rabi'], // Annual crop
    soilTypes: ['Heavy Loam', 'Clay Loam'],
    idealTemperature: '20-26°C',
    idealRainfall: '75-120 cm',
    expectedYield: 40000,
    approximateMarketPrice: 315,
    isVisible: true,
  },
  {
    id: 'cotton-gujarat-kharif',
    nameEnglish: 'Cotton',
    nameLocal: 'कपास',
    imageUrl: 'https://images.unsplash.com/photo-1633527992904-53f86f81a23a?q=80&w=1080',
    supportedStateIds: ['gujarat', 'maharashtra', 'telangana', 'punjab'],
    suitableSeasonIds: ['kharif'],
    soilTypes: ['Black Cotton Soil'],
    idealTemperature: '21-30°C',
    idealRainfall: '50-100 cm',
    expectedYield: 500,
    approximateMarketPrice: 6025,
    isVisible: true,
  },
  {
    id: 'mustard-rajasthan-rabi',
    nameEnglish: 'Mustard',
    nameLocal: 'सरसों',
    imageUrl: 'https://images.unsplash.com/photo-1421930866250-aa0594cea05c?q=80&w=1080',
    supportedStateIds: ['rajasthan', 'haryana', 'uttar-pradesh', 'madhya-pradesh'],
    suitableSeasonIds: ['rabi'],
    soilTypes: ['Sandy Loam'],
    idealTemperature: '10-25°C',
    idealRainfall: '35-50 cm',
    expectedYield: 800,
    approximateMarketPrice: 5450,
    isVisible: true,
  },
  {
    id: 'potato-uttarpradesh-rabi',
    nameEnglish: 'Potato',
    nameLocal: 'आलू',
    imageUrl: 'https://images.unsplash.com/photo-1590486803833-1c58779c5683?q=80&w=1080',
    supportedStateIds: ['uttar-pradesh', 'west-bengal', 'punjab', 'bihar'],
    suitableSeasonIds: ['rabi'],
    soilTypes: ['Well-drained Sandy Loam', 'Loamy'],
    idealTemperature: '15-20°C',
    idealRainfall: '50-75 cm',
    expectedYield: 12000,
    approximateMarketPrice: 1500,
    isVisible: true,
  },
  {
    id: 'soybean-maharashtra-kharif',
    nameEnglish: 'Soybean',
    nameLocal: 'सोयाबीन',
    imageUrl: 'https://images.unsplash.com/photo-1553786193-39908a834b69?q=80&w=1080',
    supportedStateIds: ['maharashtra', 'madhya-pradesh', 'rajasthan'],
    suitableSeasonIds: ['kharif'],
    soilTypes: ['Clay Loam'],
    idealTemperature: '20-30°C',
    idealRainfall: '60-75 cm',
    expectedYield: 1000,
    approximateMarketPrice: 4300,
    isVisible: true,
  },
  {
    id: 'groundnut-gujarat-kharif',
    nameEnglish: 'Groundnut',
    nameLocal: 'मूंगफली',
    imageUrl: 'https://images.unsplash.com/photo-1594280387556-0026332152bd?q=80&w=1080',
    supportedStateIds: ['gujarat', 'andhra-pradesh', 'karnataka', 'tamil-nadu', 'maharashtra'],
    suitableSeasonIds: ['kharif', 'rabi'],
    soilTypes: ['Sandy Loam', 'Loamy Sand'],
    idealTemperature: '25-35°C',
    idealRainfall: '50-125 cm',
    expectedYield: 1200,
    approximateMarketPrice: 5850,
    isVisible: true,
  },
  {
    id: 'chickpea-rajasthan-rabi',
    nameEnglish: 'Chickpea (Gram)',
    nameLocal: 'चना',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Cicer_arietinum_%28chickpea%29_plant.jpg',
    supportedStateIds: ['rajasthan', 'madhya-pradesh', 'maharashtra', 'uttar-pradesh'],
    suitableSeasonIds: ['rabi'],
    soilTypes: ['Light to Heavy Clay', 'Loam', 'Sandy Loam'],
    idealTemperature: '15-25°C',
    idealRainfall: '60-100 cm',
    expectedYield: 800,
    approximateMarketPrice: 4875,
    isVisible: true,
  },
];

export const weatherAlerts: WeatherAlert[] = [
  // Rain
  { id: 'rain-light', alertMessage: 'Light rain expected.', recommendedActions: 'Check crop leaves for early signs of fungal disease.', isEnabled: true, thresholdRain: 5 },
  { id: 'rain-moderate', alertMessage: 'Moderate rainfall forecast. Risk of waterlogging in poorly drained fields.', recommendedActions: 'Ensure field drainage is clear. Postpone irrigation.', isEnabled: true, thresholdRain: 15 },
  { id: 'rain-heavy', alertMessage: 'Heavy rain warning. Protect young seedlings and expect soil erosion.', recommendedActions: 'Reinforce soil bunds. Consider moving vulnerable equipment to higher ground.', isEnabled: true, thresholdRain: 40 },
  { id: 'rain-continuous', alertMessage: 'Prolonged drizzle can increase fungal risks.', recommendedActions: 'Improve air circulation around plants if possible. Monitor for mildew.', isEnabled: true, thresholdRain: 10 },

  // Temperature
  { id: 'temp-heatwave', alertMessage: 'Heatwave Alert! High temperatures can cause crop stress and wilting.', recommendedActions: 'Ensure adequate irrigation, especially during midday. Apply light mulch to retain soil moisture.', isEnabled: true, thresholdTemperatureMax: 38 },
  { id: 'temp-extreme-heat', alertMessage: 'Extreme Heat Warning. Risk of flower and fruit drop.', recommendedActions: 'Consider applying anti-transpirants. Irrigate during cooler parts of the day (early morning/late evening).', isEnabled: true, thresholdTemperatureMax: 42 },
  { id: 'temp-cool-snap', alertMessage: 'Sudden drop in temperature may slow crop growth.', recommendedActions: 'Monitor soil temperature. Ensure young plants are established.', isEnabled: true, thresholdTemperatureMax: 10 },
  { id: 'temp-frost', alertMessage: 'Frost risk overnight. Tender crops are vulnerable.', recommendedActions: 'Cover sensitive plants with cloth or plastic sheets overnight. Lightly irrigate soil in the evening.', isEnabled: true, frostRisk: true },
  { id: 'temp-low-overnight', alertMessage: 'Low overnight temperatures expected.', recommendedActions: 'Ensure greenhouse vents are closed overnight if applicable.', isEnabled: true, thresholdTemperatureMin: 8 },

  // Wind
  { id: 'wind-strong', alertMessage: 'Strong winds can cause physical damage to tall crops and increase soil moisture loss.', recommendedActions: 'Check and reinforce supports for crops like maize and sugarcane. Consider installing windbreaks.', isEnabled: true, thresholdWind: 30 },
  { id: 'wind-hot-dry', alertMessage: 'Hot, dry winds will rapidly decrease soil moisture.', recommendedActions: 'Increase irrigation frequency to compensate for high evaporation rates.', isEnabled: true, thresholdTemperatureMax: 35, thresholdWind: 20 },

  // Humidity
  { id: 'humidity-high-warm', alertMessage: 'High humidity and warm weather increase risk of fungal and bacterial diseases.', recommendedActions: 'Ensure good air circulation between plants. Proactively apply preventative fungicides if necessary.', isEnabled: true, thresholdTemperatureMin: 20, thresholdHumidity: 85 },
  { id: 'humidity-low-hot', alertMessage: 'Low humidity and high heat increases water demand significantly.', recommendedActions: 'Monitor for signs of wilting. Ensure irrigation systems are working efficiently.', isEnabled: true, thresholdTemperatureMax: 32, thresholdHumidity: 30 },
];

export const farmingTips: FarmingTip[] = [
  // General
  { id: 'tip-gen-1', tipText: 'Start the season right! Test your soil to understand nutrient needs and pH levels.', language: 'en', category: 'general', isEnabled: true },
  { id: 'tip-gen-2', tipText: 'Practice crop rotation to improve soil health, reduce pests, and increase yields.', language: 'en', category: 'general', isEnabled: true },
  { id: 'tip-gen-3', tipText: 'Regularly clean and maintain your farm equipment to ensure it runs efficiently and safely.', language: 'en', category: 'general', isEnabled: true },
  { id: 'tip-gen-4', tipText: 'Keep detailed farm records. Tracking inputs, yields, and prices helps in making better future decisions.', language: 'en', category: 'general', isEnabled: true },
  { id: 'tip-gen-5', tipText: 'Introduce beneficial insects like ladybugs to naturally control pest populations.', language: 'en', category: 'general', isEnabled: true },

  // Hot
  { id: 'tip-hot-1', tipText: 'During hot weather, irrigate in the early morning or late evening to reduce evaporation.', language: 'en', category: 'hot', isEnabled: true },
  { id: 'tip-hot-2', tipText: 'Apply a layer of mulch (like straw or compost) to keep soil cool and retain moisture.', language: 'en', category: 'hot', isEnabled: true },
  { id: 'tip-hot-3', tipText: 'Provide shade for sensitive vegetable crops during the hottest part of the day to prevent sun-scald.', language: 'en', category: 'hot', isEnabled: true },
  { id: 'tip-hot-4', tipText: 'Check crops for signs of heat stress, such as wilting leaves, even when the soil is moist.', language: 'en', category: 'hot', isEnabled: true },

  // Cold
  { id: 'tip-cold-1', tipText: 'Before a cold snap, ensure soil is moist. Moist soil retains more heat than dry soil.', language: 'en', category: 'cold', isEnabled: true },
  { id: 'tip-cold-2', tipText: 'Cover tender plants with blankets or frost cloths overnight to protect them from frost damage.', language: 'en', category: 'cold', isEnabled: true },
  { id: 'tip-cold-3', tipText: 'Delay pruning trees and shrubs until after the last frost to avoid encouraging new growth that can be damaged.', language: 'en', category: 'cold', isEnabled: true },

  // Rainy
  { id: 'tip-rainy-1', tipText: 'After heavy rain, check for waterlogging and ensure your field drainage systems are clear.', language: 'en', category: 'rainy', isEnabled: true },
  { id: 'tip-rainy-2', tipText: 'Avoid walking on or working with very wet soil to prevent compaction.', language: 'en', category: 'rainy', isEnabled: true },
  { id: 'tip-rainy-3', tipText: 'Postpone fertilizer application if heavy rain is forecast to prevent it from washing away.', language: 'en', category: 'rainy', isEnabled: true },
  { id: 'tip-rainy-4', tipText: 'Keep a close eye on crops after rain for signs of fungal diseases, which thrive in damp conditions.', language: 'en', category: 'rainy', isEnabled: true },

  // Windy
  { id: 'tip-windy-1', tipText: 'Strong winds can dry out soil quickly. Check soil moisture levels and irrigate if necessary.', language: 'en', category: 'windy', isEnabled: true },
  { id: 'tip-windy-2', tipText: 'Inspect and reinforce stakes or trellises for tall or climbing plants like tomatoes and beans.', language: 'en', category: 'windy', isEnabled: true },
  { id: 'tip-windy-3', tipText: 'Consider planting windbreaks (rows of trees or shrubs) to protect your fields from strong winds in the long term.', language: 'en', category: 'windy', isEnabled: true },
  
  // Humidity
  { id: 'tip-humidity-1', tipText: 'High humidity increases the risk of fungal diseases. Ensure good air circulation by spacing plants properly.', language: 'en', category: 'humidity', isEnabled: true },
];


export const cropLifecycles: CropLifecycle[] = [
    {
        id: 'lc-wheat',
        cropId: 'wheat-haryana-rabi',
        sowingDateRange: 'Late October to mid-November',
        seedRate: '40-50 kg/acre',
        fertilizerBasalDose: 'DAP: 50kg, MOP: 20kg, Urea: 35kg per acre',
        fertilizerTopDressing: 'Urea: 50kg per acre after 25-30 days and at flowering',
        diseasePesticideGuide: 'For Yellow Rust, spray Propiconazole. For Aphids, use Imidacloprid.',
        irrigationSchedule: 'Critical stages: Crown Root Initiation, Tillering, Flowering, and Grain Filling. About 5-6 irrigations needed.',
        harvestingWindow: 'Late March to April',
        harvestingReadinessSigns: 'Golden yellow stalks, hard and dry grains.'
    },
    {
        id: 'lc-rice',
        cropId: 'rice-westbengal-kharif',
        sowingDateRange: 'June to July for transplanting',
        seedRate: '6-8 kg/acre for transplanting',
        fertilizerBasalDose: 'SSP: 75kg, Urea: 30kg, MOP: 25kg per acre',
        fertilizerTopDressing: 'Urea: 35kg per acre in two splits, at tillering and panicle initiation',
        diseasePesticideGuide: 'For Blast, use Tricyclazole. For Stem Borer, apply Fipronil granules.',
        irrigationSchedule: 'Maintain 2-5 cm of standing water for most of the growth period. Stop irrigation 15 days before harvest.',
        harvestingWindow: 'October to December',
        harvestingReadinessSigns: '80-85% of grains on the panicle are straw-colored.'
    },
    {
        id: 'lc-maize',
        cropId: 'maize-karnataka-kharif',
        sowingDateRange: 'June to July',
        seedRate: '8-10 kg/acre',
        fertilizerBasalDose: 'DAP: 50kg, MOP: 30kg per acre at sowing',
        fertilizerTopDressing: 'Urea: 50-60kg per acre at knee-high stage and another 50-60kg at tasseling.',
        diseasePesticideGuide: 'For Fall Armyworm, use Emamectin Benzoate. For Leaf Blight, Mancozeb spray is effective.',
        irrigationSchedule: 'Requires irrigation at critical stages like tasseling and silking if there is a dry spell.',
        harvestingWindow: 'September to October',
        harvestingReadinessSigns: 'Husk turns brownish, and grains are hard and dry.'
    },
    {
        id: 'lc-sugarcane',
        cropId: 'sugarcane-maharashtra-annual',
        sowingDateRange: 'October-November (pre-seasonal) or January-February (suru)',
        seedRate: '30,000-40,000 setts (stem cuttings) per acre',
        fertilizerBasalDose: 'Heavy dose of Farm Yard Manure. Chemical: 100kg Urea, 200kg SSP, 60kg MOP per acre.',
        fertilizerTopDressing: 'Urea in multiple splits at 45, 90, and 120 days after planting.',
        diseasePesticideGuide: 'For Red Rot, use disease-free setts. For Early Shoot Borer, apply Chlorantraniliprole.',
        irrigationSchedule: 'Frequent irrigation required. Use furrow irrigation method. Water every 7-10 days in summer.',
        harvestingWindow: '12-18 months after planting, depending on variety',
        harvestingReadinessSigns: 'Leaves turn yellow and wither. Canes produce a metallic sound when tapped.'
    },
    {
        id: 'lc-cotton',
        cropId: 'cotton-gujarat-kharif',
        sowingDateRange: 'Late May to June',
        seedRate: '1-2 kg/acre for hybrid seeds',
        fertilizerBasalDose: 'Full dose of Phosphorus and Potash, and 1/3 of Nitrogen at sowing.',
        fertilizerTopDressing: 'Remaining Nitrogen in two splits, at squaring and flowering stages.',
        diseasePesticideGuide: 'For Pink Bollworm, use pheromone traps and timely sprays of specific insecticides. For Whitefly, use Acetamiprid.',
        irrigationSchedule: 'Irrigate at flowering and boll development stages. Avoid water stress.',
        harvestingWindow: 'October to January, in multiple pickings',
        harvestingReadinessSigns: 'Bolls are fully mature and have begun to crack open naturally.'
    },
    {
        id: 'lc-mustard',
        cropId: 'mustard-rajasthan-rabi',
        sowingDateRange: 'Late September to October',
        seedRate: '1.5-2 kg/acre',
        fertilizerBasalDose: '25 kg DAP per acre',
        fertilizerTopDressing: 'Urea: 25 kg per acre after 30-35 days',
        diseasePesticideGuide: 'For Aphids, spray Imidacloprid. For White Rust, use Mancozeb.',
        irrigationSchedule: 'One irrigation at flowering stage is crucial if winter rains fail.',
        harvestingWindow: 'February to March',
        harvestingReadinessSigns: 'Pods turn yellow and seeds become hard.'
    },
    {
        id: 'lc-potato',
        cropId: 'potato-uttarpradesh-rabi',
        sowingDateRange: 'October to November',
        seedRate: '600-800 kg/acre of certified seed tubers',
        fertilizerBasalDose: 'FYM: 10 tons/acre. N:P:K at 50:30:50 kg/acre.',
        fertilizerTopDressing: '50 kg Nitrogen/acre at earthing up (25-30 days after planting).',
        diseasePesticideGuide: 'For Late Blight, spray Mancozeb or Chlorothalonil. For Potato Tuber Moth, use pheromone traps.',
        irrigationSchedule: 'Frequent light irrigations are needed. Maintain soil moisture. Critical stages are stolon formation and tuber development.',
        harvestingWindow: 'January to March',
        harvestingReadinessSigns: 'Haulms (stems) start to yellow and dry up.'
    },
    {
        id: 'lc-soybean',
        cropId: 'soybean-maharashtra-kharif',
        sowingDateRange: 'Late June to early July',
        seedRate: '25-30 kg/acre',
        fertilizerBasalDose: '20 kg N, 60-80 kg P2O5, 20 kg K2O, and 20 kg Sulphur per acre',
        fertilizerTopDressing: 'No top dressing generally required as it is a legume.',
        diseasePesticideGuide: 'For Rust and Anthracnose, use Mancozeb. For Girdle Beetle, spray Triazophos.',
        irrigationSchedule: 'Critical stages are flowering and pod filling. Irrigate if there is a long dry spell.',
        harvestingWindow: 'October to November',
        harvestingReadinessSigns: 'Leaves turn yellow and drop, pods become dry.'
    },
    {
        id: 'lc-groundnut',
        cropId: 'groundnut-gujarat-kharif',
        sowingDateRange: 'June-July for Kharif, October-November for Rabi',
        seedRate: '40-50 kg kernels/acre',
        fertilizerBasalDose: 'Apply 10 tons of FYM. 10 kg N, 20 kg P2O5 per acre.',
        fertilizerTopDressing: 'Apply Gypsum at 200 kg/acre during flowering.',
        diseasePesticideGuide: 'For Tikka leaf spot, spray Carbendazim or Mancozeb. For aphids, use Imidacloprid.',
        irrigationSchedule: 'Irrigation is crucial at pegging, flowering, and pod development stages.',
        harvestingWindow: 'October-November for Kharif, February-March for Rabi',
        harvestingReadinessSigns: 'Tops of plants yellow and wither. Pods are fully developed.'
    },
    {
        id: 'lc-chickpea',
        cropId: 'chickpea-rajasthan-rabi',
        sowingDateRange: 'Late October to first week of November',
        seedRate: '30-40 kg/acre for Desi type',
        fertilizerBasalDose: '8 kg N and 16 kg P2O5 per acre.',
        fertilizerTopDressing: 'Not required as it is a pulse crop.',
        diseasePesticideGuide: 'For Wilt, use resistant varieties. For Pod Borer, spray Emamectin Benzoate.',
        irrigationSchedule: 'One irrigation at pre-flowering and one at pod development stage if needed.',
        harvestingWindow: 'February to March',
        harvestingReadinessSigns: 'Leaves turn reddish-brown and start shedding.'
    }
];

    