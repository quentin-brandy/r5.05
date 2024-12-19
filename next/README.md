## Getting Started

Follow these steps to run the application:

1. Navigate to the next directory:
```bash
cd next
```

2. Build and start the Docker containers:
```bash
docker compose up --build
```

3. Inside the app container, run Prisma commands:
```bash
npx prisma generate
npx prisma migrate dev
```

4. The development server will be running. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

