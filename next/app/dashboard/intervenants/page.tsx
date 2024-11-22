import { CreateIntervenant, } from '@/components/ui/dashboard/button';
import { Suspense } from 'react';
import { Metadata } from 'next';
import CustomersTable from '@/components/ui/dashboard/customers_table';
import { InvoicesTableSkeleton } from '@/components/skeleton/skeleton';
 
export const metadata: Metadata = {
  title: 'Intervenant',
};
export default async function Page({})
{

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Intervenants</h1>
        <CreateIntervenant />
      </div>
       <Suspense fallback={<InvoicesTableSkeleton />}>
        <CustomersTable />
      </Suspense>  
    </div>
  );
}