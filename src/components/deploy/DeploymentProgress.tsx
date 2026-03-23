'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface DeploymentProgressProps {
  deploymentId: string;
  status: string;
  total: number;
  completed: number;
  failed: number;
  currentUser?: string;
}

export function DeploymentProgressCard({
  status,
  total,
  completed,
  failed,
  currentUser,
}: DeploymentProgressProps) {
  const progress = total > 0 ? ((completed + failed) / total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Deployment Progress</CardTitle>
          <Badge
            variant={
              status === 'COMPLETED' ? 'success' :
              status === 'FAILED' ? 'destructive' :
              status === 'IN_PROGRESS' ? 'warning' : 'secondary'
            }
          >
            {status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-300 bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {completed + failed} of {total} users processed
          </p>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm">{completed} successful</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm">{failed} failed</span>
          </div>
        </div>
        {currentUser && status === 'IN_PROGRESS' && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing {currentUser}...
          </div>
        )}
      </CardContent>
    </Card>
  );
}