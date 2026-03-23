'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTemplate(id?: string) {
  const [template, setTemplate] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/templates');
    if (res.ok) setTemplates(await res.json());
    setLoading(false);
  }, []);

  const fetchTemplate = useCallback(async (templateId: string) => {
    setLoading(true);
    const res = await fetch(`/api/templates/${templateId}`);
    if (res.ok) setTemplate(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (id) fetchTemplate(id);
    else fetchTemplates();
  }, [id, fetchTemplate, fetchTemplates]);

  return { template, templates, loading, refetch: id ? () => fetchTemplate(id) : fetchTemplates };
}