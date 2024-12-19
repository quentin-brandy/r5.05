import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export async function GET() {
    try {
        const today = new Date();
        const endDate = new Date(today.setMonth(today.getMonth() + 2));
        
        // Récupérer tous les intervenants
        const { rows: intervenants } = await pool.query('SELECT id FROM "Intervenants"');
        
        for (const intervenant of intervenants) {
            const newKey = uuidv4();
            await pool.query(
                'UPDATE "Intervenants" SET key = $1, "enddate" = $2 WHERE id = $3',
                [newKey, endDate, intervenant.id]
            );
        }

        return NextResponse.json({ message: "Keys regenerated" });
    } catch (error) {
        console.error("Error regenerating keys:", error);
        return NextResponse.json({ error: "Failed to regenerate keys" }, { status: 500 });
    }
}