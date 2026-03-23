'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CampaignFormData } from '@/types/campaign';

interface CampaignFormProps {
  initialData?: Partial<CampaignFormData>;
  onSubmit: (data: CampaignFormData) => void;
  isSubmitting?: boolean;
}

export function CampaignForm({ initialData, onSubmit, isSubmitting }: CampaignFormProps) {
  const [form, setForm] = useState<CampaignFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    bannerHtml: initialData?.bannerHtml || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    isActive: initialData?.isActive ?? true,
    priority: initialData?.priority ?? 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Campaign' : 'New Campaign'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner HTML</label>
            <textarea
              value={form.bannerHtml}
              onChange={(e) => setForm({ ...form, bannerHtml: e.target.value })}
              className="w-full h-32 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <Input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Campaign'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}