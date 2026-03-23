'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserFilter } from '@/types/user';

export function useUsers(filter?: UserFilter) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter?.search) params.set('search', filter.search);
    if (filter?.department) params.set('department', filter.department);
    if (filter?.isActive !== undefined) params.set('isActive', String(filter.isActive));
    const res = await fetch(`/api/users?${params}`);
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, [filter?.search, filter?.department, filter?.isActive]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return { users, loading, refetch: fetchUsers };
}