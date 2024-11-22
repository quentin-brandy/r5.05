import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json(); // Supposons que l'ID est envoyé dans le body de la requête
        const deletedIntervenant = await prisma.intervenants.delete({
            where: { id },
        });
        return NextResponse.json(deletedIntervenant);
    } catch (error) {
        console.error('Error deleting intervenant:', error);
        return NextResponse.error();
    } finally {
        await prisma.$disconnect();
    }
}