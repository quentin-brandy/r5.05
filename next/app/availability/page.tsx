'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyKey } from '@/lib/data';
import { Intervenants , IntervenantAvailability } from '@/lib/definitions';
import Calendar from '@/components/ui/availability/Calendar';

const Availability: React.FC = () => {
    const [intervenant, setIntervenant] = useState<Intervenants | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [lastModify, setLastModify] = useState<string | undefined>();
    const router = useRouter();

    useEffect(() => {
        const verifyKeyURL = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const key = urlParams.get('key');
            if (key) {
                console.log('Key found:', key);
                let test = await verifyKey(key);
                if (test.error || test.intervenant === undefined) {
                    console.log('Error:', test.error || 'Clé invalide');
                    setErrorMessage('Clé invalide. Veuillez contacter le responsable.');
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


    const parseAvailability = (availability: string | IntervenantAvailability | never[]): IntervenantAvailability => {
        if (typeof availability === 'string') {
            try {
                return JSON.parse(availability);
            } catch {
                return { default: [] };
            }
        }
        if (Array.isArray(availability)) {
            return { default: [] };
        }
        return availability as IntervenantAvailability;
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className=" mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 ">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Gestion des disponibilités</h1>
                    {errorMessage ? (
                        <div className="text-red-600">{errorMessage}</div>
                    ) : intervenant ? (
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-xl text-blue-800">
                                    Bienvenue, {intervenant.firstname} {intervenant.lastname} ! 👋
                                </p>
                                <p className="text-blue-600 mt-2">
                                    Ici, vous pouvez gérer vos disponibilités pour les interventions.
                                </p>
                                {lastModify && (
    <div className="mt-4 text-sm text-gray-600">
        Dernière modification : {new Date(lastModify).toLocaleString('fr-FR')}
    </div>
)}
                            </div>
                            
                            <button
                                onClick={() => setIsDialogOpen(true)}
                                className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                            >
                                <span>Comment ça marche ?</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                </svg>
                            </button>

                            {isDialogOpen && (
                                <div className=" z-10 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                                        <h2 className="text-2xl font-bold mb-4">Comment gérer vos disponibilités</h2>
                                        <ul className="list-disc pl-6 space-y-2 mb-6">
                                            <li>Cliquez sur une date dans le calendrier pour la sélectionner</li>
                                            <li>Les dates en vert sont vos disponibilités actuelles</li>
                                            <li>Cliquez sur une date verte pour retirer votre disponibilité</li>
                                            <li>Les modifications sont enregistrées automatiquement</li>
                                        </ul>
                                        <button
                                            onClick={() => setIsDialogOpen(false)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            J&apos;ai compris
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6">
                            <Calendar 
        intervenantavailable={parseAvailability(intervenant?.availability || [])} 
        intervenantid={intervenant?.id} 
        intervenantworkweek={intervenant?.workweek}
        onLastModifyChange={setLastModify}
    />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="ml-4 text-gray-600">Chargement...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Availability;