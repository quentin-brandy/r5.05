'use client';
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { deleteIntervenant } from "@/lib/data";

export function CreateIntervenant() {
    return (
      <Link
        href="/dashboard/intervenants/create"
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">Create Intervenant</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </Link>
    );
  }

  


export function DeeleteIntervenant({ id }: { id: string }) {
  const handleDelete = async () => {
    await deleteIntervenant(id);
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center text-red-500 hover:text-red-700"
    >
      Supprimer
    </button>
  );
}