"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { crops as initialCrops } from '@/lib/data';
import type { Crop, Translations } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

// Simplified schema for the form
const formSchema = z.object({
  id: z.string().min(1, 'ID is required').regex(/^[a-z0-9-]+$/, 'ID must be lowercase with dashes instead of spaces.'),
  name: z.object({ en: z.string().min(1, 'Name is required') }),
  soilType: z.object({ en: z.string().min(1, 'Soil type is required') }),
  temperature: z.string().min(1, 'Temperature is required'),
  rainfall: z.string().min(1, 'Rainfall is required'),
  yieldPerAcre: z.object({ en: z.string().min(1, 'Yield is required') }),
  marketPrice: z.object({ en: z.string().min(1, 'Market price is required') }),
  sowingTime: z.object({ en: z.string().min(1, 'Sowing time is required') }),
  seedRate: z.object({ en: z.string().min(1, 'Seed rate is required') }),
  harvestingTime: z.object({ en: z.string().min(1, 'Harvesting time is required') }),
});

type FormValues = z.infer<typeof formSchema>;

// Function to create a default crop with dummy translations
const createDefaultCrop = (data: FormValues): Crop => {
    const defaultTranslations = (value: string): Translations => ({
        en: value,
        hi: value,
        mr: value,
        ta: value,
        te: value,
        bn: value,
    });
    return {
        ...data,
        id: data.id,
        image: data.id, // placeholder
        name: defaultTranslations(data.name.en),
        soilType: defaultTranslations(data.soilType.en),
        yieldPerAcre: defaultTranslations(data.yieldPerAcre.en),
        marketPrice: defaultTranslations(data.marketPrice.en),
        sowingTime: defaultTranslations(data.sowingTime.en),
        seedRate: defaultTranslations(data.seedRate.en),
        harvestingTime: defaultTranslations(data.harvestingTime.en),
        // Keep these empty for now for simplicity
        fertilizerSchedule: [],
        pesticideGuide: [],
        irrigationSchedule: [],
    };
};

export default function AdminPage() {
    const [crops, setCrops] = useState<Crop[]>(initialCrops);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const handleAddNew = () => {
        setSelectedCrop(null);
        form.reset({
            id: '',
            name: { en: '' },
            soilType: { en: '' },
            temperature: '',
            rainfall: '',
            yieldPerAcre: { en: '' },
            marketPrice: { en: '' },
            sowingTime: { en: '' },
            seedRate: { en: '' },
            harvestingTime: { en: '' },
        });
        setIsFormOpen(true);
    };

    const handleEdit = (crop: Crop) => {
        setSelectedCrop(crop);
        form.reset({
            id: crop.id,
            name: { en: crop.name.en },
            soilType: { en: crop.soilType.en },
            temperature: crop.temperature,
            rainfall: crop.rainfall,
            yieldPerAcre: { en: crop.yieldPerAcre.en },
            marketPrice: { en: crop.marketPrice.en },
            sowingTime: { en: crop.sowingTime.en },
            seedRate: { en: crop.seedRate.en },
            harvestingTime: { en: crop.harvestingTime.en },
        });
        setIsFormOpen(true);
    };

    const handleDelete = (crop: Crop) => {
        setSelectedCrop(crop);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedCrop) {
            setCrops(crops.filter(c => c.id !== selectedCrop.id));
            toast({ title: 'Crop Deleted', description: `${selectedCrop.name.en} has been removed.`, variant: 'destructive' });
        }
        setIsDeleteDialogOpen(false);
        setSelectedCrop(null);
    };
    
    const onSubmit = (values: FormValues) => {
        if (selectedCrop) {
            // Update
            const updatedCrops = crops.map(c => c.id === selectedCrop.id ? createDefaultCrop({ ...values, id: selectedCrop.id }) : c);
            setCrops(updatedCrops);
            toast({ title: 'Crop Updated', description: `${values.name.en} has been updated.` });
        } else {
            // Create
            if (crops.some(c => c.id === values.id)) {
                form.setError('id', { message: 'This ID is already in use.' });
                return;
            }
            const newCrop = createDefaultCrop(values);
            setCrops([newCrop, ...crops]);
            toast({ title: 'Crop Added', description: `${values.name.en} has been added.` });
        }
        setIsFormOpen(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Manage Crop Data</CardTitle>
                        <CardDescription>Add, edit, or remove crop information.</CardDescription>
                    </div>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Crop
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Soil Type</TableHead>
                                    <TableHead className="hidden lg:table-cell">Sowing Time</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {crops.map((crop) => (
                                    <TableRow key={crop.id}>
                                        <TableCell className="font-medium">{crop.name.en}</TableCell>
                                        <TableCell className="hidden md:table-cell">{crop.soilType.en}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{crop.sowingTime.en}</TableCell>
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
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{selectedCrop ? 'Edit Crop' : 'Add New Crop'}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <ScrollArea className="max-h-[70vh] p-1">
                                <div className="space-y-4 p-4">
                                    <FormField
                                        control={form.control}
                                        name="name.en"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Crop Name (English)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Wheat" {...field} onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        if (!selectedCrop) {
                                                            const idValue = e.target.value.toLowerCase().replace(/\s+/g, '-');
                                                            form.setValue('id', idValue);
                                                        }
                                                    }}/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unique ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., wheat" {...field} disabled={!!selectedCrop} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField control={form.control} name="soilType.en" render={({ field }) => (<FormItem><FormLabel>Soil Type</FormLabel><FormControl><Input placeholder="e.g., Loamy soil" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="temperature" render={({ field }) => (<FormItem><FormLabel>Temperature</FormLabel><FormControl><Input placeholder="e.g., 15-25°C" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="rainfall" render={({ field }) => (<FormItem><FormLabel>Rainfall</FormLabel><FormControl><Input placeholder="e.g., 50-90 cm" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="yieldPerAcre.en" render={({ field }) => (<FormItem><FormLabel>Yield/Acre</FormLabel><FormControl><Input placeholder="e.g., 20-25 Quintals" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="marketPrice.en" render={({ field }) => (<FormItem><FormLabel>Market Price</FormLabel><FormControl><Input placeholder="e.g., ₹2,000-2,200 / Quintal" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="sowingTime.en" render={({ field }) => (<FormItem><FormLabel>Sowing Time</FormLabel><FormControl><Input placeholder="e.g., October-November" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="seedRate.en" render={({ field }) => (<FormItem><FormLabel>Seed Rate</FormLabel><FormControl><Input placeholder="e.g., 100-120 kg/hectare" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="harvestingTime.en" render={({ field }) => (<FormItem><FormLabel>Harvesting Time</FormLabel><FormControl><Input placeholder="e.g., March-April" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>
                            </ScrollArea>
                            <DialogFooter className="pt-4 pr-4">
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
                            &quot;{selectedCrop?.name.en}&quot;.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
