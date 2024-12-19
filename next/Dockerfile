FROM node:18-alpine 

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour l'installation
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --only=production

# Copier le reste du projet
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Construire l'application (désactive ESLint et TypeScript)
ENV SKIP_TYPE_CHECK=true
RUN npm run build-no-check

# Exposer le port pour l'application
EXPOSE 3000

# Ajouter le script d'entrée
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Commande de démarrage
CMD ["./docker-entrypoint.sh"]