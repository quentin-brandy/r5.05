FROM node:18-alpine 

WORKDIR /app

RUN apk add --no-cache openssl netcat-openbsd

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate

EXPOSE 3000

# Option 1: Script dans le répertoire de travail
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]

# OU Option 2: Script dans /docker-entrypoint.d/
# COPY docker-entrypoint.sh /docker-entrypoint.d/
# RUN chmod +x /docker-entrypoint.d/docker-entrypoint.sh
# ENTRYPOINT ["/docker-entrypoint.d/docker-entrypoint.sh"]

CMD ["npm", "start"]