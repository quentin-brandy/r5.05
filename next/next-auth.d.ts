import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id: string;
    email: string;
  }

  interface JWT {
    id: string;
    email: string;
  }
}

declare module 'bcryptjs' {
    const hash: (password: string, salt: number | string) => Promise<string>;
    const compare: (password: string, hash: string) => Promise<boolean>;
    export { hash, compare };
    export default {
      hash,
      compare,
    };
  }