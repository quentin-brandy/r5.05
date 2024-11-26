// app/customers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Search from '@/components/ui/search';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { fetchAllIntervenants, deleteIntervenant , regenerateIntervenantKey } from '@/lib/data';
import { Intervenants } from '@/lib/definitions';
export default function CustomersTable() {
    const [intervenants, setIntervenants] = useState<Intervenants[]>([]); // Typage avec l'interface

    useEffect(() => {
        async function fetchData() {
            const data = await fetchAllIntervenants();
            setIntervenants(data);
            console.log(data);
        }
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const deleted = await deleteIntervenant(id);
            setIntervenants(prev => prev.filter(intervenant => intervenant.id !== id));
            console.log('Intervenant deleted:', deleted);
        } catch (error) {
            console.error('Failed to delete intervenant', error);
        }
    };

    const handleRegenerate = async (id: string) => {
        try {
            const regenerated = await regenerateIntervenantKey(id);
            setIntervenants(prev => 
                prev.map(intervenant => 
                    intervenant.id === id ? { ...intervenant, endDate: regenerated.endDate } : intervenant
                )
            );
            console.log('Intervenant key regenerated:', regenerated);
        } catch (error) {
            console.error('Failed to regenerate intervenant key', error);
        }
    }
    return (
        <div className="w-full mt-10">
            <Search placeholder="Search intervenants..." />
            <div className="mt-6 flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                                    <tr>
                                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                            Prénom
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Nom
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Email
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Editer
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Supprimer   
                                        </th>
                                    <th scope='col' className='px-3 py-5 font-medium'>
                                        Regénérer la clé    
                                        </th> 
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 text-gray-900">
                                    {intervenants.map((intervenant) => (
                                        <tr key={intervenant.id} className="group">
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm flex items-center">
                                                <span className={`inline-block w-2 h-2 mr-2 rounded-full ${new Date(intervenant.endDate) < new Date() ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                                {intervenant.firstname}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                {intervenant.lastname}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                {intervenant.email}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                <Link href={`/dashboard/intervenants/${intervenant.id}/edit`}>
                                                    <button className="flex items-center text-blue-500 hover:text-blue-700">
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </button>
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                <button onClick={() => handleDelete(intervenant.id)} className="text-red-500 hover:text-red-700">
                                                    Delete
                                                </button>
                                            </td>
                                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                        <button
      onClick={() => handleRegenerate(intervenant.id)}
      className="flex items-center text-green-500 hover:text-green-700"
    >
      Régénérer
    </button>                                        </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
