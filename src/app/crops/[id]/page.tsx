import { crops } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import CropDetailsClient from '@/components/crop-details-client';
import {
    Thermometer,
    CloudDrizzle,
    GitBranch,
    Tractor,
    DollarSign,
    Calendar,
    Scissors,
    Combine,
    Droplets,
    Bug,
} from 'lucide-react';

export async function generateStaticParams() {
    return crops.map((crop) => ({
        id: crop.id,
    }));
}

const getCropData = (id: string) => {
    return crops.find(c => c.id === id);
}

const iconMap = {
    soilType: <GitBranch className="h-5 w-5 text-primary" />,
    temperature: <Thermometer className="h-5 w-5 text-primary" />,
    rainfall: <CloudDrizzle className="h-5 w-5 text-primary" />,
    yieldPerAcre: <Tractor className="h-5 w-5 text-primary" />,
    marketPrice: <DollarSign className="h-5 w-5 text-primary" />,
    sowingTime: <Calendar className="h-5 w-5 text-primary" />,
    harvestingTime: <Scissors className="h-5 w-5 text-primary" />,
};

const guideIconMap = {
    fertilizer: <Combine className="h-5 w-5 text-amber-600" />,
    pesticide: <Bug className="h-5 w-5 text-amber-600" />,
    irrigation: <Droplets className="h-5 w-5 text-amber-600" />,
}

export default function CropPage({ params }: { params: { id: string } }) {
    const crop = getCropData(params.id);

    if (!crop) {
        notFound();
    }

    const placeholder = PlaceHolderImages.find(p => p.id === crop.image);

    const keyInfo = [
        { key: 'soilType', label: { en: 'Soil Type', hi: 'मिट्टी का प्रकार' }, value: crop.soilType },
        { key: 'temperature', label: { en: 'Ideal Temperature', hi: 'आदर्श तापमान' }, value: crop.temperature },
        { key: 'rainfall', label: { en: 'Ideal Rainfall', hi: 'आदर्श वर्षा' }, value: crop.rainfall },
        { key: 'yieldPerAcre', label: { en: 'Yield/Acre', hi: 'उपज/एकड़' }, value: crop.yieldPerAcre },
        { key: 'marketPrice', label: { en: 'Market Price', hi: 'बाजार मूल्य' }, value: crop.marketPrice },
        { key: 'sowingTime', label: { en: 'Sowing Time', hi: 'बुवाई का समय' }, value: crop.sowingTime },
        { key: 'harvestingTime', label: { en: 'Harvesting Time', hi: 'कटाई का समय' }, value: crop.harvestingTime },
    ];
    
    const guides = [
        {
            key: 'fertilizer',
            title: {en: 'Fertilizer Schedule', hi: 'उर्वरक अनुसूची'},
            data: crop.fertilizerSchedule,
            cols: [{key: 'stage', label: {en: 'Stage', hi: 'अवस्था'}}, {key: 'details', label: {en: 'Fertilizer', hi: 'उर्वरक'}}]
        },
        {
            key: 'pesticide',
            title: {en: 'Pesticide Guide', hi: 'कीटनाशक गाइड'},
            data: crop.pesticideGuide,
            cols: [{key: 'pest', label: {en: 'Pest/Disease', hi: 'कीट/रोग'}}, {key: 'solution', label: {en: 'Solution', hi: 'समाधान'}}]
        },
        {
            key: 'irrigation',
            title: {en: 'Irrigation Schedule', hi: 'सिंचाई अनुसूची'},
            data: crop.irrigationSchedule,
            cols: [{key: 'stage', label: {en: 'Stage', hi: 'अवस्था'}}, {key: 'frequency', label: {en: 'Frequency', hi: 'आवृति'}}]
        }
    ];

    return (
        <CropDetailsClient crop={crop} placeholder={placeholder} keyInfo={keyInfo} guides={guides} iconMap={iconMap} guideIconMap={guideIconMap} />
    );
}
