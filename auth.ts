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
      if (user) {
        token.id = user.id;
        token.fieldId = (user as any).fieldId;
        token.fieldName = (user as any).fieldName;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).fieldId = token.fieldId;
        (session.user as any).fieldName = token.fieldName;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login", 
  },
});