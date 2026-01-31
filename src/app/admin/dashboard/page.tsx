
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Wheat, Droplets, BookOpen, Database } from 'lucide-react';
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection } from "firebase/firestore";
import { useFirestore, useMemoFirebase } from "@/firebase/provider";
import Link from "next/link";
import { seedDatabase } from '@/firebase/seed';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";


function StatCard({ title, value, icon, isLoading }: { title: string, value: number | string, icon: React.ReactNode, isLoading?: boolean }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    )
}

export default function AdminDashboard() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const cropsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'crops') : null, [firestore]);
    const weatherAlertsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'weatherAlerts') : null, [firestore]);
    const tipsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'farmingTips') : null, [firestore]);

    const { data: crops, isLoading: isLoadingCrops } = useCollection(cropsCollectionRef);
    const { data: alerts, isLoading: isLoadingAlerts } = useCollection(weatherAlertsCollectionRef);
    const { data: tips, isLoading: isLoadingTips } = useCollection(tipsCollectionRef);

    const handleSeed = () => {
        if (firestore) {
            const result = seedDatabase(firestore);
            if (result.success) {
                toast({
                    title: "Database Seeding Initiated",
                    description: "Sample data is being added to the database.",
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Seeding Failed",
                    description: "Could not seed the database. Check console for errors.",
                });
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">High-level system overview and quick actions.</p>
                </div>
                 <div className="flex space-x-2">
                    <Button asChild>
                        <Link href="/admin/crops">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Crop
                        </Link>
                    </Button>
                     <Button onClick={handleSeed} variant="outline">
                        <Database className="mr-2 h-4 w-4" /> Seed Database
                    </Button>
                </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Crops" value={crops?.length ?? 0} icon={<Wheat className="h-4 w-4 text-muted-foreground" />} isLoading={isLoadingCrops} />
                <StatCard title="Weather Alerts" value={alerts?.length ?? 0} icon={<Droplets className="h-4 w-4 text-muted-foreground" />} isLoading={isLoadingAlerts} />
                <StatCard title="Farming Tips" value={tips?.length ?? 0} icon={<BookOpen className="h-4 w-4 text-muted-foreground" />} isLoading={isLoadingTips} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                     <CardDescription>Quickly add new data to the system.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                     <Button asChild>
                        <Link href="/admin/crops">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Crop
                        </Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/admin/weather">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Weather Alert
                        </Link>
                    </Button>
                     <Button asChild variant="secondary">
                        <Link href="/admin/tips">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Farming Tip
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
