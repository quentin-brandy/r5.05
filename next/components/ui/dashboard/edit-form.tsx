'use client';
import Link from 'next/link';
import { updateIntervenantAPI, fetchIntervenantbyId  } from '@/lib/data';
import { useState, useEffect } from 'react';
import { Intervenants } from '@/lib/definitions';
import { useRouter, useParams } from 'next/navigation';

const EditForm = () => {
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [formData, setFormData] = useState<Partial<Intervenants>>({});
    const router = useRouter();
    const { id } = useParams() as { id: string };

    useEffect(() => {
        const fetchIntervenant = async () => {
            try {
                const data = await fetchIntervenantbyId(id);
                if (data.enddate) {
                    data.enddate = new Date(data.enddate).toISOString().split('T')[0];
                }
                if (data.availability) {
                    data.availability = JSON.stringify(data.availability, null, 2);
                }
                if (data.workweek) {
                    data.workweek = JSON.stringify(data.workweek, null, 2);
                }
                setFormData(data);
            } catch (error) {
                console.error('Error fetching intervenant:', error);
            }
        };

        if (id) {
            fetchIntervenant();
        }
    }, [id]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const data = { ...formData };
            if (data.enddate) {
                data.enddate = new Date(data.enddate).toISOString();
            }
            if (data.availability) {
                try {
                    data.availability = typeof data.availability === 'string' ? JSON.parse(data.availability) : data.availability;
                } catch (error) {
                    setErrors({ availability: ["Format JSON invalide pour la disponibilité"] });
                    setTimeout(() => {
                        setErrors({});
                    }, 10000);
                    return;
                }
            } else {
                data.availability = {
                    default: [], // Tableau vide pour les événements par défaut
                    // Pas besoin d'initialiser d'autres semaines, elles seront créées dynamiquement
                };
            }
            if(data.workweek) {
                try {
                    data.workweek = JSON.parse(data.workweek);
                } catch (error) {
                    setErrors({ workweek: ["Format JSON invalide pour la workweek"] });
                    setTimeout(() => {
                        setErrors({});
                    }, 10000);
                    return;
                }
            }
           
            let updatedUser = await updateIntervenantAPI(id, data as Intervenants);
            if (updatedUser.error) {
                setErrors({ updatefailed: ["Erreur dans la mise à jour, assurez-vous que l'email n'existe pas déjà dans la base"] });
                setTimeout(() => {
                    setErrors({});
                }, 10000);
            } else {
                setErrors({ updatesucced: ["L'utilisateur a bien été mis à jour"] });
                setTimeout(() => {
                    router.push(`/dashboard/intervenants/`);
                }, 2000);
            }
        } catch (errors: any) {
            console.error('Error in submission:', errors);
        }
    };

    return (
        <>
            {errors.updatesucced && (
                <div className="bg-green-100 border flex justify-center border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Succès!&nbsp;</strong>
                    <span className="block sm:inline"> {errors.updatesucced}</span>
                </div>
            )}
            {errors.updatefailed && (
                <div className="bg-red-100 border flex justify-center border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Erreur!&nbsp;</strong>
                    <span className="block sm:inline"> {errors.updatefailed}</span>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="rounded-md bg-gray-50 p-4 md:p-6">
                    <div className="mb-4">
                        <label htmlFor="email" className="mb-2 block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="email-error"
                        />
                        <div id="email-error" aria-live="polite" aria-atomic="true">
                            {errors.email &&
                                errors.email.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="firstname" className="mb-2 block text-sm font-medium">
                            First Name
                        </label>
                        <input
                            id="firstname"
                            name="firstname"
                            type="text"
                            placeholder="Enter first name"
                            value={formData.firstname || ''}
                            onChange={handleChange}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="firstname-error"
                        />
                        <div id="firstname-error" aria-live="polite" aria-atomic="true">
                            {errors.firstname &&
                                errors.firstname.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="lastname" className="mb-2 block text-sm font-medium">
                            Last Name
                        </label>
                        <input
                            id="lastname"
                            name="lastname"
                            type="text"
                            placeholder="Enter last name"
                            value={formData.lastname || ''}
                            onChange={handleChange}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="lastname-error"
                        />
                        <div id="lastname-error" aria-live="polite" aria-atomic="true">
                            {errors.lastname &&
                                errors.lastname.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="enddate" className="mb-2 block text-sm font-medium">
                            End Date
                        </label>
                        <input
                            id="enddate"
                            name="enddate"
                            type="date"
                            value={formData.enddate || ''}
                            onChange={handleChange}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="enddate-error"
                        />
                        <div id="enddate-error" aria-live="polite" aria-atomic="true">
                            {errors.enddate &&
                                errors.enddate.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="availability" className="mb-2 block text-sm font-medium">
                            Availability
                        </label>
                        <textarea
                            id="availability"
                            name="availability"
                            placeholder="Enter availability in JSON format"
                            value={typeof formData.availability === 'string' ? formData.availability : JSON.stringify(formData.availability, null, 2) || ''}
                            onChange={handleChange}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="availability-error"
                        />
                        <div id="availability-error" aria-live="polite" aria-atomic="true">
                            {errors.availability &&
                                errors.availability.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="workweek" className="mb-2 block text-sm font-medium">
                            Workweek
                        </label>
                        <textarea
                            id="workweek"
                            name="workweek"
                            placeholder="Enter workweek in JSON format"
                            value={typeof formData.workweek === 'string' ? formData.workweek : JSON.stringify(formData.workweek, null, 2) || ''}
                            onChange={handleChange}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="workweek-error"
                        />
                        <div id="workweek-error" aria-live="polite" aria-atomic="true">
                            {errors.workweek &&
                                errors.workweek.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <Link
                            href="/dashboard/intervenants"
                            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400"
                        >
                            Update Intervenant
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditForm;
