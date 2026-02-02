
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
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { setDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Preprocess empty strings to undefined for optional number fields
const emptyStringToUndefined = z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().optional());

const formSchema = z.object({
  id: z.string().optional(),
  alertMessage: z.string().min(1, 'Alert message is required'),
  recommendedActions: z.string().min(1, 'Recommended actions are required'),
  thresholdRain: emptyStringToUndefined,
  thresholdTemperatureMin: emptyStringToUndefined,
  thresholdTemperatureMax: emptyStringToUndefined,
  thresholdWind: emptyStringToUndefined,
  thresholdHumidity: emptyStringToUndefined,
  frostRisk: z.boolean().default(false),
  isEnabled: z.boolean().default(true),
});

type AlertFormValues = z.infer<typeof formSchema>;

function TableSkeleton() {
  return (
    <div className="rounded-md border">
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-5 w-3/4" /></TableHead>
                <TableHead className="hidden md:table-cell"><Skeleton className="h-5 w-48" /></TableHead>
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

function getConditionText(alert: any) {
    const conditions = [];
    if (alert.frostRisk) conditions.push('Frost Risk');
    if (alert.thresholdTemperatureMax != null) conditions.push(`Temp > ${alert.thresholdTemperatureMax}°C`);
    if (alert.thresholdTemperatureMin != null) conditions.push(`Temp < ${alert.thresholdTemperatureMin}°C`);
    if (alert.thresholdRain != null) conditions.push(`Rain > ${alert.thresholdRain}mm`);
    if (alert.thresholdWind != null) conditions.push(`Wind > ${alert.thresholdWind}km/h`);
    if (alert.thresholdHumidity != null) conditions.push(`Humidity > ${alert.thresholdHumidity}%`);
    return conditions.join(' or ') || 'No condition set';
}


export default function AdminWeatherPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const alertsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'weatherAlerts'): null, [firestore]);
  const { data: alerts, isLoading, error } = useCollection<any>(alertsCollectionRef);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frostRisk: false,
      isEnabled: true,
    },
  });

  const handleAddNew = () => {
    setSelectedAlert(null);
    form.reset({
      alertMessage: '',
      recommendedActions: '',
      frostRisk: false,
      isEnabled: true,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (alert: any) => {
    setSelectedAlert(alert);
    form.reset(alert);
    setIsFormOpen(true);
  };

  const handleDelete = (alert: any) => {
    setSelectedAlert(alert);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAlert && firestore) {
      const docRef = doc(firestore, 'weatherAlerts', selectedAlert.id);
      deleteDocumentNonBlocking(docRef);
      toast({ title: 'Alert Deleted', description: `The alert has been removed.`, variant: 'destructive' });
    }
    setIsDeleteDialogOpen(false);
    setSelectedAlert(null);
  };

  const onSubmit = (values: AlertFormValues) => {
    if (!firestore) return;

    const dataToSave: any = {};
    // Clean up undefined values so they are removed from Firestore
    Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) {
            dataToSave[key] = value;
        }
    });
    
    if (selectedAlert) {
      // Update
      const docRef = doc(firestore, 'weatherAlerts', selectedAlert.id);
      updateDocumentNonBlocking(docRef, dataToSave);
      toast({ title: 'Alert Updated', description: 'The weather alert has been updated.' });
    } else {
      // Create
      const newId = `alert-${Date.now()}`;
      const docRef = doc(firestore, 'weatherAlerts', newId);
      setDocumentNonBlocking(docRef, {...dataToSave, id: newId}, { merge: false });
      toast({ title: 'Alert Added', description: 'The new weather alert has been added.' });
    }
    setIsFormOpen(false);
    form.reset();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Weather Alert Management</CardTitle>
            <CardDescription>Manage weather-based rules and alerts.</CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Alert
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton />}
          {error && (
             <div className="text-red-500 p-4 border border-red-500 rounded-md">
                <p><strong>Error:</strong> Failed to load alerts.</p>
                <p className="text-sm">{error.message}</p>
             </div>
          )}
          {!isLoading && !error && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert Message</TableHead>
                    <TableHead className="hidden md:table-cell">Condition</TableHead>
                    <TableHead>Enabled</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts?.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium max-w-sm truncate">{alert.alertMessage}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs">
                        {getConditionText(alert)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={alert.isEnabled ? 'default' : 'secondary'}>
                          {alert.isEnabled ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(alert)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(alert)}>
                            <Trash2 className="h-4 w-4" />
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAlert ? 'Edit Alert' : 'Add New Alert'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                <FormField control={form.control} name="alertMessage" render={({ field }) => (<FormItem><FormLabel>Alert Message</FormLabel><FormControl><Textarea placeholder="e.g., Heavy rainfall expected..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="recommendedActions" render={({ field }) => (<FormItem><FormLabel>Recommended Actions</FormLabel><FormControl><Textarea placeholder="e.g., Delay irrigation..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <p className="text-sm text-muted-foreground pt-2">Set one or more thresholds to trigger this alert. Leave fields blank to ignore them.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField control={form.control} name="thresholdRain" render={({ field }) => (<FormItem><FormLabel>Rain > (mm)</FormLabel><FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="thresholdWind" render={({ field }) => (<FormItem><FormLabel>Wind > (km/h)</FormLabel><FormControl><Input type="number" placeholder="e.g., 30" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="thresholdHumidity" render={({ field }) => (<FormItem><FormLabel>Humidity > (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 85" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField control={form.control} name="thresholdTemperatureMin" render={({ field }) => (<FormItem><FormLabel>Temp &lt; (°C)</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="thresholdTemperatureMax" render={({ field }) => (<FormItem><FormLabel>Temp &gt; (°C)</FormLabel><FormControl><Input type="number" placeholder="e.g., 40" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <FormField control={form.control} name="frostRisk" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background/50"><FormLabel>Frost Risk (Temp &lt;= 4°C)</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="isEnabled" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-background/50"><FormLabel>Enabled</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                </div>
              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit">{selectedAlert ? 'Save Changes' : 'Create Alert'}</Button>
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
              This will permanently delete the selected weather alert.
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
