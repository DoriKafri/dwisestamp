import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string;
      adminId?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    adminId?: string;
  }
}