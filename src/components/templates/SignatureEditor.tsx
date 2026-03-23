'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Eye } from 'lucide-react';

interface SignatureEditorProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  onNameChange: (name: string) => void;
  description?: string;
  onDescriptionChange?: (desc: string) => void;
}

export function SignatureEditor({
  value,
  onChange,
  name,
  onNameChange,
  description,
  onDescriptionChange,
}: SignatureEditorProps) {
  const [mode, setMode] = useState<'visual' | 'html'>('html');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Signature Editor</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={mode === 'visual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('visual')}
            >
              <Eye className="w-4 h-4 mr-1" /> Visual
            </Button>
            <Button
              variant={mode === 'html' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('html')}
            >
              <Code className="w-4 h-4 mr-1" /> HTML
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
          <Input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="Enter template name" />
        </div>
        {onDescriptionChange && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Input
              value={description || ''}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Optional description"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {mode === 'html' ? 'HTML Content' : 'Visual Editor'}
          </label>
          {mode === 'html' ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-64 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter HTML signature content..."
            />
          ) : (
            <div className="border rounded-md p-4 min-h-[16rem] bg-white">
              <div dangerouslySetInnerHTML={{ __html: value }} />
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500">
          Available variables: {'{'}{'{'}'fullName{'}'}{'}'}, {'{'}{'{'}'firstName{'}'}{'}'}, {'{'}{'{'}'lastName{'}'}{'}'}, {'{'}{'{'}'email{'}'}{'}'}, {'{'}{'{'}'jobTitle{'}'}{'}'}, {'{'}{'{'}'department{'}'}{'}'}, {'{'}{'{'}'phone{'}'}{'}'}, {'{'}{'{'}'avatarUrl{'}'}{'}'}</div>
      </CardContent>
    </Card>
  );
}