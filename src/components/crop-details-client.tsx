
"use client";

import Image from 'next/image';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Sprout, Layers, ShieldAlert, Droplets, Scissors } from 'lucide-react';
import type { Crop, CropLifecycle } from '@/lib/types';

interface CropDetailsClientProps {
    crop: Crop;
    cropLifecycle?: CropLifecycle;
    keyInfo: { key: string; label: any; value: string }[];
    iconMap: any;
}

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-3 border-b last:border-b-0">
        <p className="font-semibold text-sm text-muted-foreground col-span-1">{label}</p>
        <p className="text-sm col-span-2">{value || 'N/A'}</p>
    </div>
);

export default function CropDetailsClient({ crop, cropLifecycle, keyInfo, iconMap }: CropDetailsClientProps) {
    const { t, language } = useLanguage();

    const cropName = language === 'hi' && crop.nameLocal ? crop.nameLocal : crop.nameEnglish;

    const lifecycleTranslations = {
        sowingGuide: { en: 'Sowing Guide', hi: 'बुवाई गाइड' },
        sowingDate: { en: 'Sowing Date Range', hi: 'बुवाई की तारीख' },
        seedRate: { en: 'Seed Rate', hi: 'बीज दर' },
        fertilizerGuide: { en: 'Fertilizer Guide', hi: 'उर्वरक गाइड' },
        basalDose: { en: 'Basal Dose', hi: 'बेसल डोज़' },
        topDressing: { en: 'Top Dressing', hi: 'टॉप ड्रेसिंग' },
        pesticideGuide: { en: 'Disease & Pesticide', hi: 'रोग और कीटनाशक' },
        irrigationGuide: { en: 'Irrigation Guide', hi: 'सिंचाई गाइड' },
        harvestingGuide: { en: 'Harvesting Guide', hi: 'कटाई गाइड' },
        harvestingWindow: { en: 'Harvesting Window', hi: 'कटाई की अवधि' },
        readinessSigns: { en: 'Readiness Signs', hi: 'तैयारी के संकेत' },
        guideNotAvailable: { en: 'Detailed guides for this crop are not yet available.', hi: 'इस फसल के लिए विस्तृत गाइड अभी उपलब्ध नहीं हैं।' },
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <div className="relative mb-4 h-64 w-full overflow-hidden rounded-lg shadow-lg">
                    <Image
                        src={crop.imageUrl}
                        alt={cropName}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                        <h1 className="text-4xl font-bold text-white font-headline">{cropName}</h1>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t({ en: 'Key Information', hi: 'मुख्य जानकारी' })}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {keyInfo.map((info) => (
                                    <li key={info.key} className="flex items-start gap-4">
                                        <div className="flex-shrink-0">{iconMap[info.key as keyof typeof iconMap]}</div>
                                        <div>
                                            <p className="font-semibold">{t(info.label)}</p>
                                            <p className="text-muted-foreground">{info.value}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t({ en: 'Complete Crop Guide', hi: 'संपूर्ण फसल गाइड' })}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cropLifecycle ? (
                                <Accordion type="single" collapsible className="w-full" defaultValue="sowing">
                                    <AccordionItem value="sowing">
                                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                            <div className="flex items-center gap-3">
                                                <Sprout className="h-6 w-6 text-primary" />
                                                <span>{t(lifecycleTranslations.sowingGuide)}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2">
                                            <InfoRow label={t(lifecycleTranslations.sowingDate)} value={cropLifecycle.sowingDateRange} />
                                            <InfoRow label={t(lifecycleTranslations.seedRate)} value={cropLifecycle.seedRate} />
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="fertilizer">
                                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                            <div className="flex items-center gap-3">
                                                <Layers className="h-6 w-6 text-primary" />
                                                <span>{t(lifecycleTranslations.fertilizerGuide)}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2">
                                            <InfoRow label={t(lifecycleTranslations.basalDose)} value={cropLifecycle.fertilizerBasalDose} />
                                            <InfoRow label={t(lifecycleTranslations.topDressing)} value={cropLifecycle.fertilizerTopDressing} />
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="pesticide">
                                        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                            <div className="flex items-center gap-3">
                                                <ShieldAlert className="h-6 w-6 text-primary" />
                                                <span>{t(lifecycleTranslations.pesticideGuide)}</span>
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
                                                <span>{t(lifecycleTranslations.irrigationGuide)}</span>
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
                                                <span>{t(lifecycleTranslations.harvestingGuide)}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-2">
                                            <InfoRow label={t(lifecycleTranslations.harvestingWindow)} value={cropLifecycle.harvestingWindow} />
                                            <InfoRow label={t(lifecycleTranslations.readinessSigns)} value={cropLifecycle.harvestingReadinessSigns} />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-center">
                                    <p className="text-muted-foreground">{t(lifecycleTranslations.guideNotAvailable)}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
