'use client';
import { collection, doc, Firestore } from 'firebase/firestore';
import { setDocumentNonBlocking } from './non-blocking-updates';
import { crops, weatherAlerts, farmingTips } from '@/lib/seed-data';

export function seedDatabase(firestore: Firestore) {
    try {
        // Seed crops
        const cropsCollectionRef = collection(firestore, 'crops');
        crops.forEach(crop => {
            const docRef = doc(cropsCollectionRef, crop.id);
            setDocumentNonBlocking(docRef, crop, { merge: false });
        });

        // Seed weather alerts
        const alertsCollectionRef = collection(firestore, 'weatherAlerts');
        weatherAlerts.forEach(alert => {
            const docRef = doc(alertsCollectionRef, alert.id);
            setDocumentNonBlocking(docRef, alert, { merge: false });
        });

        // Seed farming tips
        const tipsCollectionRef = collection(firestore, 'farmingTips');
        farmingTips.forEach(tip => {
            const docRef = doc(tipsCollectionRef, tip.id);
            setDocumentNonBlocking(docRef, tip, { merge: false });
        });

        return { success: true };
    } catch (error) {
        console.error("Error seeding database:", error);
        return { success: false, error };
    }
}
