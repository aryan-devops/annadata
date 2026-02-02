
"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Edit, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { setDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  id: z.string().optional(),
  nameEnglish: z.string().min(1, 'English name is required'),
  nameLocal: z.string().min(1, 'Local name is required'),
  imageUrl: z.string().min(1, 'An image is required.'),
  supportedStateIds: z.string().min(1, 'Enter comma-separated state IDs'),
  suitableSeasonIds: z.string().min(1, 'Enter comma-separated season IDs'),
  soilType: z.string().min(1, 'Soil type is required'),
  idealTemperature: z.string().min(1, 'Ideal temperature is required'),
  idealRainfall: z.string().min(1, 'Ideal rainfall is required'),
  expectedYield: z.coerce.number().positive('Must be a positive number'),
  approximateMarketPrice: z.coerce.number().positive('Must be a positive number'),
  isVisible: z.boolean().default(true),
});

type CropFormValues = z.infer<typeof formSchema>;

function TableSkeleton() {
  return (
    <div className="rounded-md border">
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableHead>
                <TableHead><Skeleton className="h-5 w-16" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-10" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-10" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
    </div>
  )
}

export default function AdminCropsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<any | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const cropsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'crops'): null, [firestore]);
  const { data: crops, isLoading, error } = useCollection<any>(cropsCollectionRef);

  const form = useForm<CropFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isVisible: true,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB size limit
        toast({
          variant: "destructive",
          title: "Image too large",
          description: "Please upload an image smaller than 1MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        form.setValue('imageUrl', dataUrl, { shouldValidate: true });
        setImagePreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNew = () => {
    setSelectedCrop(null);
    const defaultImageUrl = 'https://picsum.photos/seed/placeholder/600/400';
    form.reset({
      nameEnglish: '',
      nameLocal: '',
      imageUrl: defaultImageUrl,
      supportedStateIds: '',
      suitableSeasonIds: '',
      soilType: '',
      idealTemperature: '',
      idealRainfall: '',
      expectedYield: 1,
      approximateMarketPrice: 1,
      isVisible: true,
    });
    setImagePreview(defaultImageUrl);
    setIsFormOpen(true);
  };

  const handleEdit = (crop: any) => {
    setSelectedCrop(crop);
    form.reset({
      ...crop,
      supportedStateIds: crop.supportedStateIds.join(', '),
      suitableSeasonIds: crop.suitableSeasonIds.join(', '),
    });
    setImagePreview(crop.imageUrl);
    setIsFormOpen(true);
  };

  const handleDelete = (crop: any) => {
    setSelectedCrop(crop);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCrop && firestore) {
      const docRef = doc(firestore, 'crops', selectedCrop.id);
      deleteDocumentNonBlocking(docRef);
      toast({ title: 'Crop Deleted', description: `${selectedCrop.nameEnglish} has been removed.`, variant: 'destructive' });
    }
    setIsDeleteDialogOpen(false);
    setSelectedCrop(null);
  };

  const onSubmit = (values: CropFormValues) => {
    if (!firestore) return;
    const dataToSave = {
      ...values,
      supportedStateIds: values.supportedStateIds.split(',').map(s => s.trim()),
      suitableSeasonIds: values.suitableSeasonIds.split(',').map(s => s.trim()),
    };

    if (selectedCrop) {
      // Update
      const docRef = doc(firestore, 'crops', selectedCrop.id);
      updateDocumentNonBlocking(docRef, dataToSave);
      toast({ title: 'Crop Updated', description: `${values.nameEnglish} has been updated.` });
    } else {
      // Create
      const baseId = values.nameEnglish.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 20);
      const uniquePart = Date.now().toString(36);
      const newId = baseId ? `${baseId}-${uniquePart}` : `crop-${uniquePart}`;

      const docRef = doc(firestore, 'crops', newId);
      setDocumentNonBlocking(docRef, {...dataToSave, id: newId}, { merge: false });
      toast({ title: 'Crop Added', description: `${values.nameEnglish} has been added.` });
    }
    setIsFormOpen(false);
    form.reset();
    setImagePreview(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Crop Management</CardTitle>
            <CardDescription>Manage all crop data in the system.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Crop
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton />}
          {error && (
             <div className="text-red-500 p-4 border border-red-500 rounded-md">
                <p><strong>Error:</strong> Failed to load crops.</p>
                <p className="text-sm">{error.message}</p>
             </div>
          )}
          {!isLoading && !error && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>English Name</TableHead>
                    <TableHead className="hidden md:table-cell">Local Name</TableHead>
                    <TableHead className="hidden lg:table-cell">Soil Type</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crops?.map((crop) => (
                    <TableRow key={crop.id}>
                      <TableCell className="font-medium">{crop.nameEnglish}</TableCell>
                      <TableCell className="hidden md:table-cell">{crop.nameLocal}</TableCell>
                      <TableCell className="hidden lg:table-cell">{crop.soilType}</TableCell>
                      <TableCell>
                        <Badge variant={crop.isVisible ? 'default' : 'secondary'}>
                          {crop.isVisible ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(crop)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(crop)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if (!isOpen) setImagePreview(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedCrop ? 'Edit Crop' : 'Add New Crop'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ScrollArea className="max-h-[70vh] p-1">
                <div className="space-y-4 p-4">
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Crop Image</FormLabel>
                            <FormControl>
                                <>
                                <Input
                                    type="file"
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/gif, image/webp"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Image
                                </Button>
                                </>
                            </FormControl>
                            {imagePreview && (
                                <div className="mt-4 relative w-full h-48 rounded-md border overflow-hidden">
                                <Image 
                                    src={imagePreview} 
                                    alt="Crop preview" 
                                    fill 
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                </div>
                            )}
                             <FormMessage />
                            </FormItem>
                        )}
                        />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="nameEnglish" render={({ field }) => (<FormItem><FormLabel>English Name</FormLabel><FormControl><Input placeholder="e.g., Wheat" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="nameLocal" render={({ field }) => (<FormItem><FormLabel>Local Name</FormLabel><FormControl><Input placeholder="e.g., गेहूं" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="supportedStateIds" render={({ field }) => (<FormItem><FormLabel>Supported States (IDs)</FormLabel><FormControl><Input placeholder="e.g., state-1, state-2" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="suitableSeasonIds" render={({ field }) => (<FormItem><FormLabel>Suitable Seasons (IDs)</FormLabel><FormControl><Input placeholder="e.g., kharif, rabi" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <FormField control={form.control} name="soilType" render={({ field }) => (<FormItem><FormLabel>Soil Type</FormLabel><FormControl><Input placeholder="e.g., Loamy" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="idealTemperature" render={({ field }) => (<FormItem><FormLabel>Ideal Temperature</FormLabel><FormControl><Input placeholder="e.g., 15-25°C" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="idealRainfall" render={({ field }) => (<FormItem><FormLabel>Ideal Rainfall</FormLabel><FormControl><Input placeholder="e.g., 50-90 cm" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="expectedYield" render={({ field }) => (<FormItem><FormLabel>Expected Yield (per acre)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="approximateMarketPrice" render={({ field }) => (<FormItem><FormLabel>Approx. Market Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                   </div>
                  <FormField
                    control={form.control}
                    name="isVisible"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background/50">
                        <div className="space-y-0.5">
                          <FormLabel>Visible to Farmers</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>
              <DialogFooter className="pt-4 pr-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit">{selectedCrop ? 'Save Changes' : 'Create Crop'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the crop
              &quot;{selectedCrop?.nameEnglish}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    