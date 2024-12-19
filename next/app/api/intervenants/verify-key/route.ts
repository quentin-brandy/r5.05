import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function POST(request: Request) {
    const prisma = new PrismaClient();
    try {
        const { key } = await request.json();
        const intervenant = await prisma.intervenants.findMany({
            where: { key: key },
        });

        if (!intervenant || intervenant.length === 0) {
            return NextResponse.json({ message: "Intervenant non trouvé" }, { status: 404 });
        }

        const today = new Date();
        if (intervenant[0].endDate < today) {
            return NextResponse.json({ message: "Le token est expiré" }, { status: 403 });
        }

        return NextResponse.json({ intervenant: intervenant[0] }, { status: 200 });
    } catch (error) {
        console.error("Error verifying key:", error);
        return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
    }
}