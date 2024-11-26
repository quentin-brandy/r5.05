import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

const Prisma = new PrismaClient();
export async function GET() {
    try {
        const today = new Date();
        const endDate = new Date(today.setMonth(today.getMonth() + 2));
        const intervenants = await Prisma.intervenants.findMany();
        for (const intervenant of intervenants) {
            const newKey = uuidv4();
            await Prisma.intervenants.update({
                where: { id: intervenant.id },
                data: {
                    key: newKey,
                    endDate: endDate,
                },
            });
        }
        return NextResponse.json({ message: "Keys regenerated" });
    } catch (error) {
        console.error("Error regenerating keys:", error);
    }
}