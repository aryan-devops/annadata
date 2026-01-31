"use client";

import Image from 'next/image';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import VoiceReadoutButton from './voice-readout-button';
import { Badge } from './ui/badge';

export default function CropDetailsClient({ crop, placeholder, keyInfo, guides, iconMap, guideIconMap }: {
    crop: any;
    placeholder: any;
    keyInfo: any[];
    guides: any[];
    iconMap: any;
    guideIconMap: any;
}) {
    const { t } = useLanguage();

    const generateSpokenText = (title: string, data: any[], cols: any[]) => {
        let text = `${title}. `;
        data.forEach(item => {
            cols.forEach(col => {
                text += `${t(col.label)}: ${t(item[col.key])}. `;
            });
        });
        return text;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <div className="relative mb-4 h-64 w-full overflow-hidden rounded-lg shadow-lg">
                    {placeholder && (
                        <Image
                            src={placeholder.imageUrl}
                            alt={t(crop.name)}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                            data-ai-hint={placeholder.imageHint}
                        />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-0 left-0 p-6">
                        <h1 className="text-4xl font-bold text-white font-headline">{t(crop.name)}</h1>
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
                                            <p className="text-muted-foreground">{typeof info.value === 'string' ? info.value : t(info.value)}</p>
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
                            <p className="mb-2 text-muted-foreground">{t({ en: 'Seed Rate', hi: 'बीज दर' })}: <Badge variant="secondary">{t(crop.seedRate)}</Badge></p>
                            <Accordion type="single" collapsible defaultValue="fertilizer">
                                {guides.map(guide => (
                                    <AccordionItem value={guide.key} key={guide.key}>
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                {guideIconMap[guide.key]}
                                                {t(guide.title)}
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="mb-4">
                                                <VoiceReadoutButton textToRead={generateSpokenText(t(guide.title), guide.data, guide.cols)} />
                                            </div>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        {guide.cols.map((col: any) => (
                                                            <TableHead key={col.key}>{t(col.label)}</TableHead>
                                                        ))}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {guide.data.map((item: any, index: number) => (
                                                        <TableRow key={index}>
                                                            {guide.cols.map((col: any) => (
                                                                <TableCell key={col.key}>{t(item[col.key])}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
