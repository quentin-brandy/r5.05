import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';

const Prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { key } = await request.json();
        const intervenant = await Prisma.intervenants.findMany({
            where: { key: key },
        });

        if (!intervenant) {
            return NextResponse.json({ message: "Pas d'intervenant trouvé" }, { status: 404 });
        }

        const today = new Date();
        if (intervenant.endDate < today) {
            return NextResponse.json({ message: "Le token est expiré" }, { status: 403 });
        }

        return NextResponse.json({ intervenant: intervenant[0] }, { status: 200 });
    } catch (error) {
        console.error("Error verifying key:", error);
        return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
    }
}