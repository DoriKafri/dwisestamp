'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        {session?.user && (
          <>
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </>
        )}
      </div>
    </header>
  );
}