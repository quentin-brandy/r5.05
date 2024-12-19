import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();
        const results = [];
        const client = await pool.connect();

        try {
            for (const item of requestBody) {
                const { intervenant, workweek } = item;

                const query = {
                    text: 'UPDATE "Intervenants" SET workweek = $1::json WHERE email = $2',
                    values: [JSON.stringify(workweek), intervenant]
                };

                const result = await client.query(query);

                if (result.rowCount === 0) {
                    results.push({ intervenant, status: 404 });
                } else {
                    results.push({ intervenant, status: 200 });
                }
            }
        } finally {
            client.release();
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
