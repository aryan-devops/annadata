'use client';
import { collection, doc, Firestore, getDoc } from 'firebase/firestore';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from './non-blocking-updates';
import { crops, weatherAlerts, farmingTips, cropLifecycles, states, seasons } from '@/lib/seed-data';

export async function seedDatabase(firestore: Firestore) {
    try {
        // Seed states
        const statesCollectionRef = collection(firestore, 'states');
        states.forEach(state => {
            const docRef = doc(statesCollectionRef, state.id);
            setDocumentNonBlocking(docRef, state, { merge: true });
        });

        // Seed seasons
        const seasonsCollectionRef = collection(firestore, 'seasons');
        seasons.forEach(season => {
            const docRef = doc(seasonsCollectionRef, season.id);
            setDocumentNonBlocking(docRef, season, { merge: true });
        });

        // Seed crops carefully to preserve existing images
        const cropsCollectionRef = collection(firestore, 'crops');
        for (const crop of crops) {
            const docRef = doc(cropsCollectionRef, crop.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists() && docSnap.data().imageUrl) {
                // If doc exists and has an image, update details but exclude imageUrl
                const { imageUrl, ...detailsToUpdate } = crop;
                updateDocumentNonBlocking(docRef, detailsToUpdate);
            } else {
                // If doc is new or has no image, create/update with all data
                setDocumentNonBlocking(docRef, crop, { merge: true });
            }
        }

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

    