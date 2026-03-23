'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignatureEditor } from '@/components/templates/SignatureEditor';
import { SignaturePreview } from '@/components/templates/SignaturePreview';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function NewTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, htmlContent, type: 'FOOTER' }),
    });
    if (res.ok) router.push('/templates');
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">New Template</h1>
        <Button onClick={handleSave} disabled={saving || !name || !htmlContent}>
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Template'}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SignatureEditor value={htmlContent} onChange={setHtmlContent} name={name} onNameChange={setName} description={description} onDescriptionChange={setDescription} />
        <SignaturePreview htmlContent={htmlContent} />
      </div>
    </div>
  );
}