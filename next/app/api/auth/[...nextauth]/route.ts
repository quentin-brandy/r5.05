// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from 'pg';
import { verifyPassword } from "@/lib/auth";

const pool = new Pool({
  // Ajoutez votre configuration de connexion PostgreSQL ici
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false } // Décommentez si nécessaire pour Heroku
});

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        try {
          const result = await pool.query(
            'SELECT * FROM "Users" WHERE email = $1',
            [credentials.email]
          );

          const user = result.rows[0];
          if (!user) throw new Error("No user found with the email");

          const isValid = await verifyPassword(credentials.password, user.password);
          if (!isValid) throw new Error("Incorrect password");

          return {
            id: String(user.id),
            email: user.email,
          };
        } catch (error) {
          console.error('Database error:', error);
          throw new Error("Authentication failed");
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.id = token.id as string;
      session.email = token.email as string;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };