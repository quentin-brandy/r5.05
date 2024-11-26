
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
export async function fetchIntervenantbyId(intervenantId: string) {
    try {
        const response = await fetch(`/api/intervenants/${intervenantId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch intervenant');
        }

        const intervenant = await response.json();
        return intervenant;
    } catch (error) {
        console.error('Error fetching intervenant:', error);
        throw error;
    }
}

export async function updateIntervenantAPI(intervenantId: string, data: IntervenantCreation) {
    try {
        const response = await fetch(`/api/intervenants/${intervenantId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update intervenant');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error updating intervenant:', error);
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

export async function regenerateIntervenantKey(intervenantId: string) {
    try {
        const response = await fetch(`/api/intervenants/${intervenantId}/regenerate-key`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('Failed to regenerate intervenant key');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error regenerating intervenant key:', error);
        throw error;
    }
}

export async function RegenerateAllIntervenantKey() {
    try {
        const response = await fetch(`/api/intervenants/regenerate-all-key`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to regenerate all intervenant key');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error regenerating all intervenant key:', error);
        throw error;
    }
}