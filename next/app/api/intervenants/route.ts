import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export async function GET() {
        try {
                const result = await pool.query('SELECT * FROM "Intervenants"');
                return NextResponse.json(result.rows);
        } catch (error) {
                console.error('Error fetching intervenants:', error);
                return NextResponse.error();
        }
}

export async function DELETE(request: Request) {
        try {
                const { id } = await request.json();
                const result = await pool.query(
                        'DELETE FROM "Intervenants" WHERE id = $1 RETURNING *',
                        [id]
                );
                return NextResponse.json(result.rows[0]);
        } catch (error) {
                console.error('Error deleting intervenant:', error);
                return NextResponse.error();
        }
}

export async function POST(request: Request) {
        try {
                const { email, firstname, lastname, availability } = await request.json();
                const key = uuidv4();
                const creationDate = new Date();
                const endDate = new Date(creationDate);
                endDate.setMonth(endDate.getMonth() + 2);

                const result = await pool.query(
                        `INSERT INTO "Intervenants" (email, firstname, lastname, key, availability, "enddate" , "creationdate")
                         VALUES ($1, $2, $3, $4, $5, $6 , $7)
                         RETURNING *`,
                        [email, firstname, lastname, key, availability, endDate , creationDate]
                );

                return NextResponse.json(result.rows[0]);
        } catch (error) {
                console.error('Error creating intervenant:', error);
                return NextResponse.error();
        }
}
