import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const intervenants = await prisma.intervenants.findMany();
        return NextResponse.json(intervenants);
    } catch (error) {
        console.error('Error fetching intervenants:', error);
        return NextResponse.error();
    } finally {
        await prisma.$disconnect();
    }
}

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
