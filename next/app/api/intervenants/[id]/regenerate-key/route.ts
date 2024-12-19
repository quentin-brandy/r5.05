import { NextRequest } from "next/server";
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
    // Ajoutez vos configurations de connexion ici
    connectionString: process.env.DATABASE_URL
});

export async function POST(
        req: NextRequest,
        { params }: { params: { id: string } }
) {
        const id = params.id;

        if (!id) {
                return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const key = uuidv4();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 2);

        const client = await pool.connect();
        
        try {
                const query = 'UPDATE "Intervenants" SET key = $1, "endDate" = $2 WHERE id = $3 RETURNING *';
                const values = [key, endDate, Number(id)];
                
                const result = await client.query(query, values);
                
                if (result.rows.length === 0) {
                        return NextResponse.json({ error: "Intervenant not found" }, { status: 404 });
                }

                return NextResponse.json(result.rows[0], { status: 200 });
        } catch (error) {
                console.error(error);
                return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        } finally {
                client.release();
        }
}