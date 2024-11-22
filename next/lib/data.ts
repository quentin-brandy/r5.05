import { PrismaClient } from '@prisma/client';
import { Intervenants } from './definitions';

const prisma = new PrismaClient();

export async function fetchAllIntervenants(): Promise<Intervenants[]> {
    try {
        const intervenants = await prisma.intervenants.findMany();
        return intervenants as Intervenants[];
    } catch (error) {
        console.error('Error fetching intervenants:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}