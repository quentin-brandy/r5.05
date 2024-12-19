import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const results = [];

        for (const item of requestBody) {
            const { intervenant, workweek } = item;

            const updatedIntervenant = await prisma.intervenants.updateMany({
                where: {
                    email: intervenant
                },
                data: {
                    workweek: workweek
                }
            });

            if (updatedIntervenant.count === 0) {
                results.push({ intervenant, status: 404 });
            } else {
                results.push({ intervenant, status: 200 });
            }
        }

        const errors = results.filter(result => result.status === 404);
        if (errors.length > 0) {
            return NextResponse.json(
                { error: 'Some intervenants were not found', details: errors },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Intervenant availabilities updated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating intervenants:', error);
        return NextResponse.json(
            { error: 'Failed to update intervenant availabilities' },
            { status: 500 }
        );
    }
}
