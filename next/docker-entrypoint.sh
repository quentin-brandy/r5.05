#!/bin/bash

echo "Attente de la base de données..."
while ! nc -z db 5432; do
  sleep 1
done

echo "Mise à jour de la base de données avec Prisma..."
npx prisma migrate dev

echo "Construction de l'application..."
npm run build-no-check

echo "Démarrage de l'application..."
exec npm start