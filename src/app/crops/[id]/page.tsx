
"use client";

import { notFound, useParams } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { doc, collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';
import {
    Thermometer,
    CloudDrizzle,
    GitBranch,
    Tractor,
    DollarSign,
} from 'lucide-react';

import CropDetailsClient from '@/components/crop-details-client';
import type { Crop, CropLifecycle } from '@/lib/types';

const iconMap = {
    soilType: <GitBranch className="h-5 w-5 text-primary" />,
    temperature: <Thermometer className="h-5 w-5 text-primary" />,
    rainfall: <CloudDrizzle className="h-5 w-5 text-primary" />,
    yieldPerAcre: <Tractor className="h-5 w-5 text-primary" />,
    marketPrice: <DollarSign className="h-5 w-5 text-primary" />,
};


export default function CropPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const firestore = useFirestore();

    const cropRef = useMemoFirebase(
        () => (firestore && id ? doc(firestore, 'crops', id) : null),
        [firestore, id]
    );
    const { data: crop, isLoading: isLoadingCrop, error: cropError } = useDoc<Crop>(cropRef);

    const lifecycleQuery = useMemoFirebase(
        () => (firestore && id ? query(collection(firestore, 'cropLifecycles'), where('cropId', '==', id)) : null),
        [firestore, id]
    );
    const { data: lifecycleData, isLoading: isLoadingLifecycle, error: lifecycleError } = useCollection<CropLifecycle>(lifecycleQuery);
    
    const cropLifecycle = lifecycleData?.[0];

    if (isLoadingCrop || isLoadingLifecycle) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        );
    }

    if (cropError || lifecycleError) {
        console.error("Error loading crop data:", cropError, lifecycleError);
        return (
            <div className="flex h-screen items-center justify-center text-red-500">
                Error loading crop data. Please check the console for details.
            </div>
        );
    }

    if (!crop) {
        notFound();
    }

    const keyInfo = [
        { key: 'soilType', label: { en: 'Soil Type', hi: 'मिट्टी का प्रकार' }, value: crop.soilType },
        { key: 'temperature', label: { en: 'Ideal Temperature', hi: 'आदर्श तापमान' }, value: crop.idealTemperature },
        { key: 'rainfall', label: { en: 'Ideal Rainfall', hi: 'आदर्श वर्षा' }, value: crop.idealRainfall },
        { key: 'yieldPerAcre', label: { en: 'Yield/Acre', hi: 'उपज/एकड़' }, value: `${crop.expectedYield}` },
        { key: 'marketPrice', label: { en: 'Market Price', hi: 'बाजार मूल्य' }, value: `₹${crop.approximateMarketPrice}` },
    ];

    return (
        <CropDetailsClient 
            crop={crop} 
            cropLifecycle={cropLifecycle}
            keyInfo={keyInfo} 
            iconMap={iconMap}
        />
    );
}
