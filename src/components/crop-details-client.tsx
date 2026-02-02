
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Sprout, Layers, ShieldAlert, Droplets, Scissors } from 'lucide-react';
import type { Crop, CropLifecycle } from '@/lib/types';
import { DynamicText } from './dynamic-text';

interface CropDetailsClientProps {
    crop: Crop;
    cropLifecycle?: CropLifecycle;
    keyInfo: { key: string; label: any; value: string }[];
    iconMap: any;
}

const InfoRow = ({ label, value }: { label: React.ReactNode; value?: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-3 border-b last:border-b-0">
        <p className="font-semibold text-sm text-muted-foreground col-span-1">{label}</p>
        <p className="text-sm col-span-2">{value || 'N/A'}</p>
    </div>
);

export default function CropDetailsClient({ crop, cropLifecycle, keyInfo, iconMap }: CropDetailsClientProps) {
    const imageUrl = crop.imageUrl || 'https://picsum.photos/seed/generic-detail/1200/800';

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in">
            <header className="mb-8">
                <div className="relative mb-4 h-64 w-full overflow-hidden rounded-lg shadow-lg">
                    <Image
                        src={imageUrl}
                        alt={crop.nameEnglish}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                        <h1 className="text-4xl font-bold text-white font-headline">
                            <DynamicText english={crop.nameEnglish} hindi={crop.nameLocal} />
                        </h1>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <Card className="opacity-0 animate-fade-in-up" style={{animationDelay: '100ms'}}>
                        <CardHeader>
                            <CardTitle><DynamicText english="Key Information" /></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {keyInfo.map((info) => (
                                    <li key={info.key} className="flex items-start gap-4">
                                        <div className="flex-shrink-0">{iconMap[info.key as keyof typeof iconMap]}</div>
                                        <div>
                                            <p className="font-semibold"><DynamicText english={info.label.en} /></p>
                                            <p className="text-muted-foreground">{info.value}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="opacity-0 animate-fade-in-up" style={{animationDelay: '200ms'}}>
                        <CardHeader>
                            <CardTitle><DynamicText english="Complete Crop Guide" /></CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cropLifecycle ? (
                                <Accordion type="single" collapsible className="w-full" defaultValue="sowing">
                                    <AccordionItem value="sowing">
                                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                            <div className="flex items-center gap-3">
                                                <Sprout className="h-6 w-6 text-primary" />
                                                <span><DynamicText english="Sowing Guide" /></span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2">
                                            <InfoRow label={<DynamicText english="Sowing Date Range" />} value={cropLifecycle.sowingDateRange} />
                                            <InfoRow label={<DynamicText english="Seed Rate" />} value={cropLifecycle.seedRate} />
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="fertilizer">
                                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                            <div className="flex items-center gap-3">
                                                <Layers className="h-6 w-6 text-primary" />
                                                <span><DynamicText english="Fertilizer Guide" /></span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2">
                                            <InfoRow label={<DynamicText english="Basal Dose" />} value={cropLifecycle.fertilizerBasalDose} />
                                            <InfoRow label={<DynamicText english="Top Dressing" />} value={cropLifecycle.fertilizerTopDressing} />
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="pesticide">
                                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                            <div className="flex items-center gap-3">
                                                <ShieldAlert className="h-6 w-6 text-primary" />
                                                <span><DynamicText english="Disease & Pesticide" /></span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2 text-sm">
                                           <p>{cropLifecycle.diseasePesticideGuide}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="irrigation">
                                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                            <div className="flex items-center gap-3">
                                                <Droplets className="h-6 w-6 text-primary" />
                                                <span><DynamicText english="Irrigation Guide" /></span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2 text-sm">
                                            <p>{cropLifecycle.irrigationSchedule}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="harvest">
                                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                            <div className="flex items-center gap-3">
                                                <Scissors className="h-6 w-6 text-primary" />
                                                <span><DynamicText english="Harvesting Guide" /></span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2">
                                            <InfoRow label={<DynamicText english="Harvesting Window" />} value={cropLifecycle.harvestingWindow} />
                                            <InfoRow label={<DynamicText english="Readiness Signs" />} value={cropLifecycle.harvestingReadinessSigns} />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-center">
                                    <p className="text-muted-foreground"><DynamicText english="Detailed guides for this crop are not yet available." /></p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
