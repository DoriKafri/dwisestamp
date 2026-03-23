'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Copy, Trash2 } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string | null;
  type: string;
  isDefault: boolean;
  isActive: boolean;
  updatedAt: string;
  _count?: { assignments: number };
}

interface TemplateGridProps {
  templates: Template[];
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TemplateGrid({ templates, onDuplicate, onDelete }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card key={template.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{template.name}</CardTitle>
              <div className="flex gap-1">
                <Badge variant={template.type === 'HEADER' ? 'secondary' : 'default'}>
                  {template.type.toLowerCase()}
                </Badge>
                {template.isDefault && <Badge variant="success">default</Badge>}
              </div>
            </div>
            {template.description && (
              <p className="text-sm text-gray-500 mt-1">{template.description}</p>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-gray-600">
              {template._count?.assignments || 0} users assigned
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Link href={`/templates/${template.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => onDuplicate?.(template.id)}>
              <Copy className="w-4 h-4 mr-1" /> Duplicate
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete?.(template.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}