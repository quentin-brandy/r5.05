
import { Intervenants } from './definitions';



export async function fetchAllIntervenants(): Promise<Intervenants[]> {
    try {
        const response = await fetch('/api/intervenants', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch intervenants');
        }

        const intervenants = await response.json();
        return intervenants as Intervenants[];
    } catch (error) {
        console.error('Error fetching intervenants:', error);
        throw error;
    }
}


export async function deleteIntervenant(intervenantId: string) {
    try {
        const response = await fetch(`/api/intervenants`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: intervenantId }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete intervenant');
        }
    } catch (error) {
        console.error('Error deleting intervenant:', error);
        throw error;
    }
}


import { IntervenantCreation } from '@/lib/definitions';





export async function createIntervenantAPI(data: IntervenantCreation) {
    try {
        const response = await fetch('/api/intervenants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        if (error instanceof Error) {
            return { error: `Failed to create intervenant via API: ${error.message}` };
        } else {
            return { error: 'Failed to create intervenant via API: Unknown error' };
        }
    }
}