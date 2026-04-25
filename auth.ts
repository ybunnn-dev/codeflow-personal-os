// auth.ts (or wherever you placed it)
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            include: { field: true },
          });

          if (user && await bcrypt.compare(credentials.password as string, user.password!)) {
            // This now perfectly matches the `User` interface in next-auth.d.ts
            return {
              id: user.id,
              name: [user.firstName, user.middleName, user.lastName, user.suffix]
                .filter(Boolean)
                .join(" "),
              firstName: user.firstName,
              middleName: user.middleName,
              lastName: user.lastName,
              suffix: user.suffix,
              email: user.email,
              fieldId: user.fieldId,
              fieldName: user.field?.name ?? null,
            };
          }

          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  
  session: { 
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  
  callbacks: {
    async jwt({ token, user }) {
      // User object is only passed in the very first time they log in
      if (user) {
        token.id = user.id!;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.fieldId = user.fieldId;
        token.fieldName = user.fieldName;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Pass the data from the token to the frontend session
      if (token && session.user) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.fieldId = token.fieldId;
        session.user.fieldName = token.fieldName;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login", 
  },
});