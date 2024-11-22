'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createIntervenantAPI } from '@/lib/data';
import { useState } from 'react';
import { IntervenantCreation } from '@/lib/definitions';
import { useRouter } from 'next/navigation';

const CreateForm = () => {
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const router = useRouter();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log('submit');
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log('Form data:', data); // Vérifiez ici que les données sont correctement récupérées
    
        try {
                data.availability = JSON.parse(data.availability as string);
                if (typeof data.availability !== 'object') {
                    setTimeout(() => {
                    setErrors({ availability: ['Availability must be a valid JSON object'] });
                }, 5000);
                    return;
                }
            let newuser = await createIntervenantAPI(data as unknown as IntervenantCreation);
            console.log('Intervenant créé avec succès');
            console.log(newuser);
            if (newuser.error) {
                console.log('error');
                setErrors({ creationfailed: ["Erreur dans la création ,  assurez vous que l'email n'existe pas déjà dans la base"] });
                setTimeout(() => {
                    setErrors({});
                }, 10000);
            }
            if (newuser.id) {
                setErrors({ creationsucced: ["L'utilisateur a bien été crée"] });
                setTimeout(() => {
                    router.push(`/dashboard/intervenants/`);
            }, 2000);
            }
        } catch (errors: any) {
            console.error('Error in submission:', errors); // Affichez les erreurs éventuelles
        }
    };

    return (
        <>
        {errors.creationsucced && (
            <div className="bg-green-100 border flex justify-center border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Succès!&nbsp;</strong>
                <span className="block sm:inline"> {errors.creationsucced}</span>
            </div>
        )}
        {errors.creationfailed && (
            <div className="bg-red-100 border flex justify-center border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Erreur!&nbsp;</strong>
                <span className="block sm:inline"> {errors.creationfailed}</span>
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
                        <label htmlFor="availability" className="mb-2 block text-sm font-medium">
                            Availability
                        </label>
                        <textarea
                            id="availability"
                            name="availability"
                            placeholder='Enter availability as JSON, e.g. {"monday": true, "tuesday": false}'
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

                    <div className="mt-6 flex justify-end gap-4">
                        <Link
                            href="/dashboard/intervenants"
                            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                        >
                            Cancel
                        </Link>
                        <Button type="submit">Create Intervenant</Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CreateForm;
