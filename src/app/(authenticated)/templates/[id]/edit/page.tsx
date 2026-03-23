'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SignatureEditor } from '@/components/templates/SignatureEditor';
import { SignaturePreview } from '@/components/templates/SignaturePreview';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/templates/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setDescription(data.description || '');
        setHtmlContent(data.htmlContent);
        setLoading(false);
      });
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/templates/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, htmlContent }),
    });
    if (res.ok) router.push('/templates');
    setSaving(false);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Template</h1>
        <Button onClick={handleSave} disabled={saving || !name || !htmlContent}>
          <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SignatureEditor value={htmlContent} onChange={setHtmlContent} name={name} onNameChange={setName} description={description} onDescriptionChange={setDescription} />
        <SignaturePreview htmlContent={htmlContent} />
      </div>
    </div>
  );
}