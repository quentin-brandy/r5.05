import { NextResponse } from "next/server";
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export async function POST(request: Request) {
        try {
                const { key } = await request.json();
                
                const query = 'SELECT * FROM "Intervenants" WHERE key = $1';
                const result = await pool.query(query, [key]);
                
                if (!result.rows || result.rows.length === 0) {
                        return NextResponse.json({ message: "Intervenant non trouvé" }, { status: 404 });
                }

                const intervenant = result.rows[0];
                const today = new Date();
                
                if (new Date(intervenant.enddate) < today) {
                        return NextResponse.json({ message: "Le token est expiré" }, { status: 403 });
                }

                return NextResponse.json({ intervenant }, { status: 200 });
        } catch (error) {
                console.error("Error verifying key:", error);
                return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
        }
}