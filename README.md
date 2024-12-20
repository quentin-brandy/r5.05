## Commencer

Suivez ces étapes pour exécuter l'application :

1. Accédez au répertoire next :
```bash
cd next
```

2. Construisez et démarrez les conteneurs Docker :
```bash
docker compose up --build
```

3. À l'intérieur du conteneur de l'application, exécutez les commandes Prisma :
```bash
npx prisma generate
npx prisma migrate dev
```

4. Changez dans le fichier `.env` les variables `NEXT_PUBLIC_BASE_URL` et `NEXTAUTH_URL` par l'URL du code space.

5. Le serveur de développement sera en cours d'exécution. Ouvrez [http://localhost:3000](http://localhost:3000) avec votre navigateur pour voir le résultat.
```bash
docker compose down 
docker compose up
```