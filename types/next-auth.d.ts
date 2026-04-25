// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  // 1. Extend the Session User
  interface Session {
    user: {
      id: string;
      firstName?: string | null;
      middleName?: string | null;
      lastName?: string | null;
      suffix?: string | null;
      fieldId?: string | null;
      fieldName?: string | null;
    } & DefaultSession["user"];
  }

  // 2. Extend the base User object returned by `authorize`
  interface User {
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    suffix?: string | null;
    fieldId?: string | null;
    fieldName?: string | null;
  }
}

declare module "next-auth/jwt" {
  // 3. Extend the JWT token
  interface JWT {
    id: string;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    suffix?: string | null;
    fieldId?: string | null;
    fieldName?: string | null;
  }
}