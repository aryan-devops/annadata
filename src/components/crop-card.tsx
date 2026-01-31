import Link from 'next/link';
import Image from 'next/image';
import type { Crop } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CropCardProps {
  crop: Crop;
}

const translations = {
  viewDetails: { en: 'View Details', hi: 'विवरण देखें', mr: ' तपशील पहा', ta: 'விவரங்களைக் காண்க', te: 'వివరాలను చూడండి', bn: 'বিস্তারিত দেখুন' },
  soil: { en: 'Soil', hi: 'मिट्टी', mr: 'माती', ta: 'மண்', te: 'నేల', bn: 'মাটি' },
};

export default function CropCard({ crop }: CropCardProps) {
  const { t } = useLanguage();
  const placeholder = PlaceHolderImages.find(p => p.id === crop.image);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {placeholder && (
            <Image
              src={placeholder.imageUrl}
              alt={t(crop.name)}
              fill
              style={{ objectFit: 'cover' }}
              data-ai-hint={placeholder.imageHint}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-xl font-bold font-headline">{t(crop.name)}</CardTitle>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">{t(translations.soil)}:</span> {t(crop.soilType)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/crops/${crop.id}`}>
            {t(translations.viewDetails)}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
