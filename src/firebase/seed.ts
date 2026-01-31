'use client';
import { collection, doc, Firestore } from 'firebase/firestore';
import { setDocumentNonBlocking } from './non-blocking-updates';
import { crops, weatherAlerts, farmingTips, cropLifecycles } from '@/lib/seed-data';

export function seedDatabase(firestore: Firestore) {
    try {
        // Seed crops
        const cropsCollectionRef = collection(firestore, 'crops');
        crops.forEach(crop => {
            const docRef = doc(cropsCollectionRef, crop.id);
            setDocumentNonBlocking(docRef, crop, { merge: true });
        });

        // Seed weather alerts
        const alertsCollectionRef = collection(firestore, 'weatherAlerts');
        weatherAlerts.forEach(alert => {
            const docRef = doc(alertsCollectionRef, alert.id);
            setDocumentNonBlocking(docRef, alert, { merge: true });
        });

        // Seed farming tips
        const tipsCollectionRef = collection(firestore, 'farmingTips');
        farmingTips.forEach(tip => {
            const docRef = doc(tipsCollectionRef, tip.id);
            setDocumentNonBlocking(docRef, tip, { merge: true });
        });
        
        // Seed crop lifecycles
        const lifecyclesCollectionRef = collection(firestore, 'cropLifecycles');
        cropLifecycles.forEach(lifecycle => {
            const docRef = doc(lifecyclesCollectionRef, lifecycle.id);
            setDocumentNonBlocking(docRef, lifecycle, { merge: true });
        });

        return { success: true };
    } catch (error) {
        console.error("Error seeding database:", error);
        return { success: false, error };
    }
}
