'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}