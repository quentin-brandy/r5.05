import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

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


export async function POST(request: Request) {
    try {
        const { email, firstname, lastname, availability } = await request.json();
        const key = uuidv4();
        const creationDate = new Date();
        const endDate = new Date(creationDate);
        endDate.setMonth(endDate.getMonth() + 2);

        const newIntervenant = await prisma.intervenants.create({
            data: {
                email,
                firstname,
                lastname,
                key,
                availability,
                creationDate,
                endDate,
            },
        });
        return NextResponse.json(newIntervenant);
    } catch (error) {
        console.error('Error creating intervenant:', error);
        return NextResponse.error();
    } finally {
        await prisma.$disconnect();
    }
}

