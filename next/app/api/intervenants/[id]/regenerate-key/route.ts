import { NextApiRequest } from "next";
import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(
    req: NextApiRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const key = uuidv4();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 2);

    try {
        const updatedIntervenant = await prisma.intervenants.update({
            where: { id: Number(id) },
            data: { key: key , endDate: endDate },
        });

        return NextResponse.json(updatedIntervenant, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}