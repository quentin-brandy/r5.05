#!/bin/bash
set -e

echo "Attente de la base de données..."
npx prisma migrate deploy

echo "Démarrage de l'application..."
exec npm start