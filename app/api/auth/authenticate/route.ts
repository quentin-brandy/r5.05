// pages/api/auth/authenticate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from '@/app/lib/action'; // Assurez-vous que authenticate est une fonction côté serveur

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 
    const { email, password } = req.body;
    
    try {
      // Appel à la fonction d'authentification (assurez-vous que cette fonction est bien définie)
      const user = await authenticate(undefined , email, password);
      
      // Si l'authentification est réussie, on renvoie l'utilisateur
      res.status(200).json({ user });
    } catch (error) {
      // Si une erreur survient, renvoyer une erreur générique
      res.status(500).json({ message: 'Authentication failed' });
    }
}

