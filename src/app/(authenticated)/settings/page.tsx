'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Save, Zap } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    setSaving(false);
  };

  const handleTestConnection = async () => {
    setTestResult(null);
    const res = await fetch('/api/settings/test-connection', { method: 'POST' });
    setTestResult(await res.json());
  };

  if (!settings) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Organization Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <Input value={settings.companyName || ''} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Domain</label>
              <Input value={settings.companyDomain || ''} onChange={(e) => setSettings({ ...settings, companyDomain: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deployment Concurrency</label>
              <Input type="number" value={settings.deploymentConcurrency || 5} onChange={(e) => setSettings({ ...settings, deploymentConcurrency: parseInt(e.target.value) })} />
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Google Workspace Connection</CardTitle></CardHeader>
          <CardContent>
            <Button onClick={handleTestConnection} variant="outline">
              <Zap className="w-4 h-4 mr-2" /> Test Connection
            </Button>
            {testResult && (
              <div className="mt-4">
                <Badge variant={testResult.success ? 'success' : 'destructive'}>{testResult.success ? 'Connected' : 'Failed'}</Badge>
                <p className="text-sm text-gray-600 mt-2">{testResult.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}