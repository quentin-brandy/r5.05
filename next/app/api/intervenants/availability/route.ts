import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const intervenants = await prisma.intervenants.findMany({
            select: {
                firstname: true,
                lastname: true,
                availability: true
            }
        });

        const formattedData: { [key: string]: any } = {};

        for (const intervenant of intervenants) {
            const name = `${intervenant.firstname} ${intervenant.lastname}`;
            
            if (!intervenant.availability) {
                formattedData[name] = [];
                continue;
            }

            // Utiliser directement la disponibilité sans parser
            formattedData[name] = intervenant.availability;
        }

        return new NextResponse(JSON.stringify(formattedData, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': 'attachment; filename=intervenants-availability.json'
            }
        });

    } catch (error) {
        console.error('Error exporting intervenants:', error);
        return NextResponse.json(
            { error: 'Failed to export intervenants availability' },
            { status: 500 }
        );
    }
}