'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface Deployment {
  id: string;
  status: string;
  totalUsers: number;
  successCount: number;
  failCount: number;
  createdAt: string;
  template: { name: string };
  admin: { name: string | null; email: string };
}

interface DeploymentHistoryProps {
  deployments: Deployment[];
  onRollback?: (id: string) => void;
}

export function DeploymentHistory({ deployments, onRollback }: DeploymentHistoryProps) {
  const statusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success' as const;
      case 'FAILED': return 'destructive' as const;
      case 'IN_PROGRESS': return 'warning' as const;
      default: return 'secondary' as const;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Template</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Users</th>
            <th className="px-4 py-3 text-left">Deployed By</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deployments.map((d) => (
            <tr key={d.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{d.template.name}</td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant(d.status)}>{d.status.replace('_', ' ')}</Badge>
              </td>
              <td className="px-4 py-3">
                <span className="text-green-600">{d.successCount}</span>
                {' / '}
                <span className="text-red-600">{d.failCount}</span>
                {' / '}
                {d.totalUsers}
              </td>
              <td className="px-4 py-3 text-gray-600">{d.admin.name || d.admin.email}</td>
              <td className="px-4 py-3 text-gray-600">{new Date(d.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                {d.status === 'COMPLETED' && (
                  <Button variant="ghost" size="sm" onClick={() => onRollback?.(d.id)}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}