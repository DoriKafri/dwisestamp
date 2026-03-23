import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
}

export function DashboardCard({ title, value, description, icon }: DashboardCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <div className="text-gray-400">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}