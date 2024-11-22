'use client';
import { useEffect, useState } from 'react';
import { Edit } from 'lucide-react';
import Link from 'next/link';

export default function CustomersTable() {
    const [intervenants, setIntervenants] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('/api/intervenants');
            if (res.ok) {
                const data = await res.json();
                setIntervenants(data);
            }
        }
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        const res = await fetch('/api/intervenants', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });

        if (res.ok) {
            setIntervenants(prev => prev.filter(intervenant => intervenant.id !== id));
        } else {
            console.error('Failed to delete intervenant');
        }
    };

    return (
        <div className="w-full mt-10">
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
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 text-gray-900">
                                    {intervenants.map((intervenant) => (
                                        <tr key={intervenant.id} className="group">
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm flex items-center">
                                                <span className="inline-block w-2 h-2 mr-2 bg-green-500 rounded-full"></span>
                                                {intervenant.firstname}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                {intervenant.lastname}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                {intervenant.email}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                <Link href={`/edit/${intervenant.id}`}>
                                                    <button className="flex items-center text-blue-500 hover:text-blue-700">
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </button>
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                <button
                                                    onClick={() => handleDelete(intervenant.id)}
                                                    className="flex items-center text-red-500 hover:text-red-700"
                                                >
                                                    Supprimer
                                                </button>
                                            </td>
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
