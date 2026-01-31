"use client";

import Image from 'next/image';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CropDetailsClient({ crop, keyInfo, iconMap }: {
    crop: any;
    keyInfo: any[];
    iconMap: any;
}) {
    const { t, language } = useLanguage();

    const cropName = language === 'hi' && crop.nameLocal ? crop.nameLocal : crop.nameEnglish;

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
                    <div className="absolute inset-0 bg-black/40" />
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
                                        {iconMap[info.key as keyof typeof iconMap]}
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
                            <p className="text-muted-foreground">
                                {t({ 
                                    en: 'Detailed guides for sowing, fertilizer, pesticides, and harvesting are coming soon.',
                                    hi: 'बुवाई, उर्वरक, कीटनाशकों और कटाई के लिए विस्तृत गाइड जल्द ही आ रहे हैं।'
                                })}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
