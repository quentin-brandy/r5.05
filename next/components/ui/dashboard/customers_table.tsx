import Search from '@/components/ui/search';
import { fetchAllIntervenants } from '@/lib/data';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { Trash } from 'lucide-react';
// import { DeleteInvoice } from './button';

export default async function CustomersTable() {
    const intervenants = await fetchAllIntervenants();
    console.log(intervenants);
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
                                            {/* <DeleteInvoice id={intervenant.id} /> */}
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
