'use client';
import React, { useEffect, useState } from 'react';
import { Intervenants } from '@/lib/definitions';
import Calendar from '@/components/ui/availability/Calendar';
import { fetchAllIntervenants } from '@/lib/data'; 
import { IntervenantAvailability } from '@/lib/definitions';

const AdminAvailability: React.FC = () => {
    const [intervenants, setIntervenants] = useState<Intervenants[]>([]);
    const [selectedIntervenant, setSelectedIntervenant] = useState<Intervenants | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lastModify, setLastModify] = useState<string | undefined>();

    useEffect(() => {
        const loadIntervenants = async () => {
            try {
                const data = await fetchAllIntervenants();
                setIntervenants(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading intervenants:', error);
                setIsLoading(false);
            }
        };

        loadIntervenants();
    }, []);
    const parseAvailability = (availability: string | IntervenantAvailability): IntervenantAvailability => {
        if (typeof availability === 'string') {
            return JSON.parse(availability);
        }
        return availability;
    };
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Administration des disponibilités
                    </h1>

                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="ml-4 text-gray-600">Chargement...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Intervenant Selection */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <label htmlFor="intervenant" className="block text-sm font-medium text-gray-700 mb-2">
                                    Sélectionner un intervenant
                                </label>
                                <select
    id="intervenant"
    className="w-full p-2 border border-gray-300 rounded-md"
    onChange={(e) => {
        const selected = intervenants.find(i => String(i.id) === e.target.value);
        setSelectedIntervenant(selected || null);
    }}
    value={selectedIntervenant?.id ? String(selectedIntervenant.id) : ''}
>
    <option value="">Choisir un intervenant</option>
    {intervenants.map((intervenant) => (
        <option key={String(intervenant.id)} value={String(intervenant.id)}>
            {intervenant.firstname} {intervenant.lastname}
        </option>
    ))}
</select>
                            </div>

                            {selectedIntervenant && (
                                <>
                                {lastModify && (
    <div className="mt-4 text-sm text-gray-600">
        Dernière modification : {new Date(lastModify).toLocaleString('fr-FR')}
    </div>
)}
                                    {/* <button
                                        onClick={() => setIsDialogOpen(true)}
                                        className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                                    >
                                        <span>Comment ça marche ?</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                        </svg>
                                    </button> */}

                                    <div className="mt-6">
                                    <Calendar 
    intervenantavailable={selectedIntervenant.availability ? parseAvailability(selectedIntervenant.availability) : { default: [] }} 
    intervenantid={selectedIntervenant.id} 
    onLastModifyChange={setLastModify}
    intervenantworkweek={selectedIntervenant.workweek}
/>
                                    </div>
                                </>
                            )}

                            {isDialogOpen && (
                                <div className="z-10 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                                        <h2 className="text-2xl font-bold mb-4">Comment gérer les disponibilités</h2>
                                        <ul className="list-disc pl-6 space-y-2 mb-6">
                                            <li>Sélectionnez un intervenant dans la liste déroulante</li>
                                            <li>Cliquez sur une date dans le calendrier pour la sélectionner</li>
                                            <li>Les dates en vert sont les disponibilités actuelles</li>
                                            <li>Cliquez sur une date verte pour retirer la disponibilité</li>
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAvailability;