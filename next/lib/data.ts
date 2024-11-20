import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchAllIntervenants() {
    try {
        const intervenants = await prisma.intervenants.findMany();
        return intervenants;
    } catch (error) {
        console.error('Error fetching intervenants:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}