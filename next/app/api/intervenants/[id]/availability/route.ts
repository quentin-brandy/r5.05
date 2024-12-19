import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

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

        const result = await pool.query(
            'UPDATE "Intervenants" SET availability = $1 WHERE id = $2 RETURNING *',
            [availability, Number(id)]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Intervenant not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Availability updated successfully', 
            updatedIntervenant: result.rows[0] 
        });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ 
            error: error instanceof Error ? error.message : "Internal Server Error" 
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT id, firstname, lastname, availability 
            FROM "Intervenants"
        `);

        const formattedData: { [key: string]: string[] } = {};

        for (const row of result.rows) {
            const name = `${row.firstname} ${row.lastname}`;
            
            if (!row.availability) {
                formattedData[name] = [];
                continue;
            }

            try {
                const availability = JSON.parse(row.availability);
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