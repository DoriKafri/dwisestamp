'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TemplateGrid } from '@/components/templates/TemplateGrid';
import { Plus } from 'lucide-react';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);

  const fetchTemplates = async () => {
    const res = await fetch('/api/templates');
    if (res.ok) setTemplates(await res.json());
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleDuplicate = async (id: string) => {
    await fetch(`/api/templates/${id}/duplicate`, { method: 'POST' });
    fetchTemplates();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    await fetch(`/api/templates/${id}`, { method: 'DELETE' });
    fetchTemplates();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Link href="/templates/new">
          <Button><Plus className="w-4 h-4 mr-2" /> New Template</Button>
        </Link>
      </div>
      <TemplateGrid templates={templates} onDuplicate={handleDuplicate} onDelete={handleDelete} />
    </div>
  );
}