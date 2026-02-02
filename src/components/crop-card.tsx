
import Link from 'next/link';
import Image from 'next/image';
import type { Crop } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { DynamicText } from './dynamic-text';

interface CropCardProps {
  crop: Crop;
}

export default function CropCard({ crop }: CropCardProps) {
  const imageUrl = crop.imageUrl || 'https://picsum.photos/seed/generic-crop/600/400';

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg h-full">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={crop.nameEnglish}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-xl font-bold font-headline">
          <DynamicText english={crop.nameEnglish} hindi={crop.nameLocal} />
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold"><DynamicText english="Soil" />:</span> {(crop.soilTypes || []).join(', ')}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/crops/${crop.id}`}>
            <DynamicText english="View Details" />
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
