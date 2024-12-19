import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export async function GET() {
    try {
        const query = `
            SELECT firstname, lastname, availability
            FROM "Intervenants"
        `;
        
        const { rows } = await pool.query(query);
        const formattedData: { [key: string]: any } = {};

        for (const row of rows) {
            const name = `${row.firstname} ${row.lastname}`;
            formattedData[name] = row.availability || [];
        }

        // Add export_date field
        const exportDate = new Date();
        exportDate.setHours(exportDate.getHours() + 1);
        formattedData.export_date = exportDate.toISOString();

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
    } finally {
        // Optionnel: si vous voulez libérer le pool après chaque requête
         await pool.end();
    }
}
