
import { PlusIcon } from "lucide-react";
import Link from "next/link";
// import { deleteInvoice } from "@/lib/actions";
// import { TrashIcon } from "lucide-react";
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

  


// export function DeleteInvoice({ id }: { id: string }) {
//   const handleDelete = async () => {
//     try {
//       await fetch(`/api/intervenants/${id}`, { method: 'DELETE' });
//       console.log(`Intervenant ${id} supprimé`);
//       // Si nécessaire, appeler une fonction pour mettre à jour l'interface utilisateur
//     } catch (error) {
//       console.error('Erreur lors de la suppression:', error);
//     }
//   };

//   return (
//     <button
//       onClick={handleDelete}
//       className="flex items-center text-red-500 hover:text-red-700"
//     >
//       Supprimer
//     </button>
//   );
// }