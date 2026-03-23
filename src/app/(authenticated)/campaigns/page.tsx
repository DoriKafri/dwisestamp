'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CampaignForm } from '@/components/campaigns/CampaignForm';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import { CampaignFormData } from '@/types/campaign';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    const res = await fetch('/api/campaigns');
    if (res.ok) setCampaigns(await res.json());
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleCreate = async (data: CampaignFormData) => {
    await fetch('/api/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setShowForm(false);
    fetchCampaigns();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    fetchCampaigns();
  };

  const statusVariant = (status: string) => {
    switch (status) { case 'active': return 'success' as const; case 'scheduled': return 'warning' as const; case 'expired': return 'destructive' as const; default: return 'secondary' as const; }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" /> New Campaign
        </Button>
      </div>
      {showForm && <div className="mb-6"><CampaignForm onSubmit={handleCreate} /></div>}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Period</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3"><Badge variant={statusVariant(c.status)}>{c.status}</Badge></td>
                <td className="px-4 py-3 text-gray-600">{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{c.priority}</td>
                <td className="px-4 py-3 flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}