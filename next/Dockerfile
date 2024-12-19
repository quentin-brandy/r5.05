FROM node:18-alpine 

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production # Installation plus rapide et propre

COPY . .
RUN npx prisma generate
RUN npm run build-no-check

EXPOSE 3000

COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]