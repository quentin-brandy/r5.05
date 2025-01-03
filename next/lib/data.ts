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

export async function verifyKey(key: string) {
    try {
        const response = await fetch(`/api/intervenants/verify-key`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key }),
        });

        if (!response.ok) {
            throw new Error('Failed to verify intervenant key');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error verifying intervenant key:', error);
        throw error;
    }
}
export async function modifyIntervenantAvailability(intervenantId: string, availability: any) {
    try {
        const response = await fetch(`/api/intervenants/${intervenantId}/availability`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ availability }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to modify intervenant availability');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export async function ExportAvailability() {
    try {
        const response = await fetch(`/api/intervenants/availability`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to export intervenant availability');
        }

        return response;
    } catch (error) {
        console.error('Error exporting intervenant availability:', error);
        throw error;
    }
}

export async function ImportWorkWeekData(data: any) {
    try {
        const response = await fetch('/api/intervenants/workweek', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to import workweek data');
        }

        return response;
    } catch (error) {
        console.error('Error importing workweek data:', error);
        throw error;
    }
}