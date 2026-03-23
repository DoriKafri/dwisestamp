'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DeploymentProgress } from '@/types/deployment';

export function useDeployment(deploymentId?: string) {
  const [progress, setProgress] = useState<DeploymentProgress | null>(null);
  const [isDone, setIsDone] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startTracking = useCallback((id: string) => {
    if (eventSourceRef.current) eventSourceRef.current.close();

    const es = new EventSource(`/api/deployments/${id}/stream`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.data);
      if (data.type === 'done') {
        setIsDone(true);
        es.close();
      }
    };

    es.onerror = () => { es.close(); setIsDone(true); };
  }, []);

  useEffect(() => {
    if (deploymentId) startTracking(deploymentId);
    return () => { eventSourceRef.current?.close(); };
  }, [deploymentId, startTracking]);

  return { progress, isDone, startTracking };
}