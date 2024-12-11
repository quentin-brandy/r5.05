import { NextApiRequest, NextApiResponse } from 'next';

type Intervenant = {
    availability: any;
};

let intervenant: Intervenant = {
    availability: null,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const data = req.body;
            intervenant.availability = data;
            res.status(200).json({ message: 'Availability updated successfully', intervenant });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}