'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">DWiseStamp</CardTitle>
          <CardDescription>Sign in to manage email signatures for your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
            Sign in with Google
          </Button>
          <p className="text-xs text-gray-500 text-center mt-4">Only @develeap.com accounts are allowed</p>
        </CardContent>
      </Card>
    </div>
  );
}