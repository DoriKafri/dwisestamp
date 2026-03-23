'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { UserTable } from '@/components/users/UserTable';
import { UserFilters } from '@/components/users/UserFilters';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState<string | undefined>();
  const [activeOnly, setActiveOnly] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchUsers = useCallback(async () => {
    const params = new URLSearchParams();
    if (selectedDept) params.set('department', selectedDept);
    if (activeOnly) params.set('isActive', 'true');
    const res = await fetch(`/api/users?${params}`);
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
      const depts = Array.from(new Set(data.map((u: any) => u.department).filter(Boolean))) as string[];
      setDepartments(depts.sort());
    }
  }, [selectedDept, activeOnly]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSync = async () => {
    setSyncing(true);
    await fetch('/api/users/sync', { method: 'POST' });
    await fetchUsers();
    setSyncing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={handleSync} disabled={syncing} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync from Workspace'}
        </Button>
      </div>
      <div className="mb-4">
        <UserFilters departments={departments} selectedDepartment={selectedDept} onDepartmentChange={setSelectedDept} showActiveOnly={activeOnly} onActiveToggle={() => setActiveOnly(!activeOnly)} />
      </div>
      <UserTable users={users} />
    </div>
  );
}