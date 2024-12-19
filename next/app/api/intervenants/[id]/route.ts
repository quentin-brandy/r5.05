import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

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
                const result = await pool.query(
                        'SELECT * FROM "Intervenants" WHERE id = $1',
                        [Number(id)]
                );

                if (result.rows.length === 0) {
                        return NextResponse.json({ error: "Intervenant not found" }, { status: 404 });
                }

                return NextResponse.json(result.rows[0], { status: 200 });
        } catch (error) {
                return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
        // Map to correct column names
        const columnMapping: { [key: string]: string } = {
            endDate: 'endDate',
            firstName: 'firstname',
            lastName: 'lastname',
            email: 'email',
            availability: 'availability',
            workweek: 'workweek',
            key: 'key'
        };

        const fields = Object.keys(data)
            .filter(key => key !== 'creationDate')
            .map(key => columnMapping[key] || key);
        const values = Object.values(data)
            .filter((_, index) => Object.keys(data)[index] !== 'creationDate')
            .map((value, index) => {
                const key = Object.keys(data)[index];
                if (key === 'availability' || key === 'workweek') {
                    return JSON.stringify(value);
                }
                return value;
            });
        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

        try {
            const result = await pool.query(
                `UPDATE "Intervenants" SET ${setClause} WHERE id = $1 RETURNING *`,
                [Number(id), ...values]
            );

                if (result.rows.length === 0) {
                        return NextResponse.json({ error: "Intervenant not found" }, { status: 404 });
                }

                return NextResponse.json(result.rows[0], { status: 200 });
        } catch (error) {
                return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
}
