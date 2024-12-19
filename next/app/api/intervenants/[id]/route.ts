import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {

    const id = params.id;
    console.log(id);

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
        const intervenant = await prisma.intervenants.findUnique({
            where: { id: Number(id) },
        });

        if (!intervenant) {
            return NextResponse.json({ error: "Intervenant not found" }, { status: 404 });
        }

        return NextResponse.json(intervenant, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const data = await request.json();

    try {
        const updatedIntervenant = await prisma.intervenants.update({
            where: { id: Number(id) },
            data: data,
        });

        return NextResponse.json(updatedIntervenant, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
