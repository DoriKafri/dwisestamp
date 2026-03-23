'use client';

import React, { useEffect, useState } from 'react';
import { DeploymentWizard } from '@/components/deploy/DeploymentWizard';
import { DeploymentHistory } from '@/components/deploy/DeploymentHistory';
import { DeploymentProgressCard } from '@/components/deploy/DeploymentProgress';

export default function DeployPage() {
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [activeDeployment, setActiveDeployment] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    fetch('/api/templates').then(r => r.json()).then(setTemplates);
    fetch('/api/users?isActive=true').then(r => r.json()).then(setUsers);
    fetch('/api/deployments').then(r => r.json()).then(setDeployments);
  }, []);

  const handleDeploy = async (templateId: string, userIds: string[]) => {
    setIsDeploying(true);
    const res = await fetch('/api/deployments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, userIds }),
    });
    if (res.ok) {
      const deployment = await res.json();
      setActiveDeployment(deployment);

      const eventSource = new EventSource(`/api/deployments/${deployment.id}/stream`);
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setActiveDeployment((prev: any) => ({ ...prev, ...data.data }));
        if (data.type === 'done') {
          eventSource.close();
          setIsDeploying(false);
          fetch('/api/deployments').then(r => r.json()).then(setDeployments);
        }
      };
      eventSource.onerror = () => { eventSource.close(); setIsDeploying(false); };
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Deploy Signatures</h1>
      <div className="space-y-6">
        <DeploymentWizard templates={templates} users={users} onDeploy={handleDeploy} isDeploying={isDeploying} />
        {activeDeployment && (
          <DeploymentProgressCard
            deploymentId={activeDeployment.id}
            status={activeDeployment.status}
            total={activeDeployment.total || activeDeployment.totalUsers}
            completed={activeDeployment.completed || activeDeployment.successCount || 0}
            failed={activeDeployment.failed || activeDeployment.failCount || 0}
            currentUser={activeDeployment.currentUser}
          />
        )}
        <div>
          <h2 className="text-lg font-semibold mb-4">Deployment History</h2>
          <DeploymentHistory deployments={deployments} />
        </div>
      </div>
    </div>
  );
}