import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const isDev = process.env.NODE_ENV === 'development';
const providers: NextAuthOptions['providers'] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'placeholder') {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    authorization: { params: { hd: 'develeap.com', prompt: 'consent', access_type: 'offline' } },
  }));
}

if (isDev) {
  providers.push(CredentialsProvider({
    name: 'Dev Login',
    credentials: { email: { label: 'Email', type: 'email', placeholder: 'admin@develeap.com' } },
    async authorize(credentials) {
      if (!credentials?.email?.endsWith('@develeap.com')) return null;
      let admin = await prisma.admin.findUnique({ where: { email: credentials.email } });
      if (!admin) {
        admin = await prisma.admin.create({
          data: { email: credentials.email, name: credentials.email.split('@')[0], role: 'SUPER_ADMIN' },
        });
      }
      return { id: admin.id, email: admin.email, name: admin.name };
    },
  }));
}

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user }) {
      if (!user.email?.endsWith('@develeap.com')) return false;
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const admin = await prisma.admin.findUnique({ where: { email: user.email } });
        if (admin) { token.role = admin.role; token.adminId = admin.id; }
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
  pages: { signIn: '/login' },
};
