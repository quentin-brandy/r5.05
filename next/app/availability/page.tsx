'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyKey } from '@/lib/data';
import { Intervenants } from '@/lib/definitions';
import Calendar from '@/components/ui/availability/Calendar';

const Availability: React.FC = () => {
    const [intervenant, setIntervenant] = useState<Intervenants | null>(null);
    const router = useRouter();
    useEffect(() => {
        const verifyKeyURL = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const key = urlParams.get('key');
            if (key) {
                console.log('Key found:', key);
                let test = await verifyKey(key);
                if (test.error) {
                    console.log('Error:', test.error);
                    router.replace('/404');
                } else {
                    setIntervenant(test.intervenant);
                    console.log(test.intervenant);
                }
            } else {
                console.log('No key found in URL');
                router.replace('/404');
            }
        };

        verifyKeyURL();
    }, [router]);

    const testok = () => {
        console.log(intervenant);
    }

    return (
        <div>
            <h1>Availability Page</h1>
            {intervenant ? (
                <p onClick={testok}>Bonjour {intervenant.firstname} {intervenant.lastname}</p>
            ) : (
                <p>Loading...</p>
            )}
            <Calendar intervenantavailable={intervenant?.availability || []} />
        </div>
    );
};

export default Availability;