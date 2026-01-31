
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PlusCircle, Edit, Trash2, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { setDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  id: z.string().optional(),
  tipText: z.string().min(1, 'Tip text is required'),
  language: z.string().min(2, 'Language code is required').max(5),
  scheduledDate: z.date({ required_error: 'A date is required.' }),
  isEnabled: z.boolean().default(true),
});

type TipFormValues = z.infer<typeof formSchema>;

function TableSkeleton() {
  return (
    <div className="rounded-md border">
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-5 w-3/4" /></TableHead>
                <TableHead className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead><Skeleton className="h-5 w-16" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
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

export default function AdminTipsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState<any | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const tipsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'farmingTips'): null, [firestore]);
  const { data: tips, isLoading, error } = useCollection<any>(tipsCollectionRef);

  const form = useForm<TipFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: 'en',
      isEnabled: true,
    },
  });

  const handleAddNew = () => {
    setSelectedTip(null);
    form.reset({
      tipText: '',
      language: 'en',
      scheduledDate: new Date(),
      isEnabled: true,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (tip: any) => {
    setSelectedTip(tip);
    form.reset({ ...tip, scheduledDate: new Date(tip.scheduledDate) });
    setIsFormOpen(true);
  };

  const handleDelete = (tip: any) => {
    setSelectedTip(tip);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTip && firestore) {
      const docRef = doc(firestore, 'farmingTips', selectedTip.id);
      deleteDocumentNonBlocking(docRef);
      toast({ title: 'Tip Deleted', description: 'The farming tip has been removed.', variant: 'destructive' });
    }
    setIsDeleteDialogOpen(false);
    setSelectedTip(null);
  };

  const onSubmit = (values: TipFormValues) => {
    if (!firestore) return;
    
    const dataToSave = {
        ...values,
        scheduledDate: values.scheduledDate.toISOString(),
    };

    if (selectedTip) {
      // Update
      const docRef = doc(firestore, 'farmingTips', selectedTip.id);
      updateDocumentNonBlocking(docRef, dataToSave);
      toast({ title: 'Tip Updated', description: 'The farming tip has been updated.' });
    } else {
      // Create
      const newId = `tip-${Date.now()}`;
      const docRef = doc(firestore, 'farmingTips', newId);
      setDocumentNonBlocking(docRef, {...dataToSave, id: newId}, { merge: false });
      toast({ title: 'Tip Added', description: 'The new farming tip has been added.' });
    }
    setIsFormOpen(false);
    form.reset();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Farming Tip Management</CardTitle>
            <CardDescription>Manage daily farming tips for users.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Tip
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton />}
          {error && <div className="text-red-500 p-4 border border-red-500 rounded-md"><p><strong>Error:</strong> {error.message}</p></div>}
          {!isLoading && !error && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tip Text</TableHead>
                    <TableHead className="hidden md:table-cell">Scheduled Date</TableHead>
                    <TableHead>Enabled</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tips?.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()).map((tip) => (
                    <TableRow key={tip.id}>
                      <TableCell className="font-medium max-w-md truncate">{tip.tipText}</TableCell>
                      <TableCell className="hidden md:table-cell">{format(new Date(tip.scheduledDate), 'PPP')}</TableCell>
                      <TableCell>
                        <Badge variant={tip.isEnabled ? 'default' : 'secondary'}>
                          {tip.isEnabled ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(tip)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(tip)}><Trash2 className="h-4 w-4" /></Button>
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTip ? 'Edit Tip' : 'Add New Tip'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                <FormField control={form.control} name="tipText" render={({ field }) => (<FormItem><FormLabel>Tip Text</FormLabel><FormControl><Textarea placeholder="e.g., Check soil moisture before irrigating..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="language" render={({ field }) => (<FormItem><FormLabel>Language</FormLabel><FormControl><Input placeholder="e.g., en" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="scheduledDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Scheduled Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                        <FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="isEnabled" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background/50"><FormLabel>Enabled</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit">{selectedTip ? 'Save Changes' : 'Create Tip'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the selected farming tip.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Continue</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
