import Form from '@/components/ui/dashboard/create-form';
import Breadcrumbs from '@/components/ui/dashboard/breadcrumbs';
import { Metadata } from "next";
export const metadata: Metadata = {
  title: 'Create Invoice',
};
export default async function Page() {

 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Intervenants', href: '/dashboard/intervenants' },
          {
            label: 'Create Intervenant',
            href: '/dashboard/intervenants/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}