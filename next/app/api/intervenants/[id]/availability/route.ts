import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
        const id = params.id;
        console.log(id);
    
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }
    try {
        const { availability } = await request.json();
        if (!availability) {
            return NextResponse.json({ error: "Availability data is required" }, { status: 400 });
        }

        const updatedIntervenant = await prisma.intervenants.update({
            where: { id: Number(id) },
            data: { availability },
        });
        if (!updatedIntervenant) {
            return NextResponse.json({ error: "Intervenant not found" }, { status: 404 });
        }
        return NextResponse.json({ message: 'Availability updated successfully', updatedIntervenant });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "Internal Server Error" 
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Récupérer tous les intervenants avec leurs disponibilités
        const intervenants = await prisma.intervenants.findMany({
            select: {
                id: true,
                firstname: true,
                lastname: true,
                availability: true
            }
        });

        // Formater les données comme dans data.json
        const formattedData: { [key: string]: string[] } = {};

        for (const intervenant of intervenants) {
            const name = `${intervenant.firstname} ${intervenant.lastname}`;
            
            if (!intervenant.availability) {
                formattedData[name] = [];
                continue;
            }

            try {
                const availability = JSON.parse(intervenant.availability as string);
                formattedData[name] = availability;
            } catch (error) {
                console.error(`Error parsing availability for ${name}:`, error);
                formattedData[name] = [];
            }
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