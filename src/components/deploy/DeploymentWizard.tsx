'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight } from 'lucide-react';

interface Template { id: string; name: string; type: string; }
interface User { id: string; email: string; fullName: string | null; department: string | null; }

interface DeploymentWizardProps {
  templates: Template[];
  users: User[];
  onDeploy: (templateId: string, userIds: string[]) => void;
  isDeploying?: boolean;
}

const STEPS = ['Select Template', 'Select Users', 'Review', 'Deploy'];

export function DeploymentWizard({ templates, users, onDeploy, isDeploying }: DeploymentWizardProps) {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const canNext = step === 0 ? !!selectedTemplate : step === 1 ? selectedUsers.length > 0 : true;

  const handleDeploy = () => {
    onDeploy(selectedTemplate, selectedUsers);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i < step ? 'bg-primary text-white' : i === step ? 'border-2 border-primary text-primary' : 'border-2 border-gray-300 text-gray-400'}`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
            </React.Fragment>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="space-y-3">
            {templates.map((t) => (
              <div
                key={t.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedTemplate === t.id ? 'border-primary bg-blue-50' : 'hover:border-gray-400'}`}
                onClick={() => setSelectedTemplate(t.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t.name}</span>
                  <Badge variant="secondary">{t.type.toLowerCase()}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-2">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-600">{selectedUsers.length} users selected</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedUsers(selectedUsers.length === users.length ? [] : users.map(u => u.id))}>
                {selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            {users.map((u) => (
              <label key={u.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={() => {
                  setSelectedUsers(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id]);
                }} className="rounded" />
                <div>
                  <p className="text-sm font-medium">{u.fullName || u.email}</p>
                  <p className="text-xs text-gray-500">{u.department || 'No department'}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Template</h4>
              <p className="mt-1">{templates.find(t => t.id === selectedTemplate)?.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Users ({selectedUsers.length})</h4>
              <div className="mt-1 flex flex-wrap gap-1">
                {selectedUsers.slice(0, 10).map(id => {
                  const user = users.find(u => u.id === id);
                  return <Badge key={id} variant="secondary">{user?.fullName || user?.email}</Badge>;
                })}
                {selectedUsers.length > 10 && <Badge variant="outline">+{selectedUsers.length - 10} more</Badge>}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <p className="text-lg font-medium">Ready to deploy</p>
            <p className="text-gray-500 mt-2">This will update signatures for {selectedUsers.length} users.</p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(s => s + 1)} disabled={!canNext}>
              Next
            </Button>
          ) : (
            <Button onClick={handleDeploy} disabled={isDeploying}>
              {isDeploying ? 'Deploying...' : 'Deploy Now'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}