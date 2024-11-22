// 'use server'
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function deleteInvoice(invoiceId: string) {
//     try {
//         const deletedInvoice = await prisma.intervenants.delete({
//             where: { id: invoiceId },
//         });
//         return deletedInvoice;
//     } catch (error) {
//         console.error('Error fetching intervenants:', error);
//         throw error;
//     } finally {
//         await prisma.$disconnect();
//     }
// }