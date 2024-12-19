FROM node:18-alpine 

WORKDIR /app

RUN apk add --no-cache openssl netcat-openbsd

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build-no-check
EXPOSE 3000



CMD ["npm", "start"]