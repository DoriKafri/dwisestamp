import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          hd: 'develeap.com',
          prompt: 'consent',
          access_type: 'offline',
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user }) {
      if (!user.email?.endsWith('@develeap.com')) {
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const admin = await prisma.admin.findUnique({
          where: { email: user.email },
        });
        if (admin) {
          token.role = admin.role;
          token.adminId = admin.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).adminId = token.adminId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};