'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

interface User {
  id: string;
  email: string;
  fullName: string | null;
  department: string | null;
  jobTitle: string | null;
  isActive: boolean;
  assignments?: Array<{ template: { id: string; name: string; type: string } }>;
}

interface UserTableProps {
  users: User[];
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onSearch?: (query: string) => void;
}

type SortKey = 'fullName' | 'email' | 'department';

export function UserTable({
  users,
  selectable,
  selectedIds = [],
  onSelectionChange,
  onSearch,
}: UserTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('fullName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...users].sort((a, b) => {
    const aVal = (a[sortKey] || '').toLowerCase();
    const bVal = (b[sortKey] || '').toLowerCase();
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const toggleSelect = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    onSelectionChange?.(next);
  };

  const toggleAll = () => {
    if (selectedIds.length === users.length) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(users.map((u) => u.id));
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) =>
    sortKey === column ? (
      sortDir === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
    ) : null;

  return (
    <div>
      <div className="mb-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearch?.(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === users.length && users.length > 0}
                    onChange={toggleAll}
                    className="rounded"
                  />
                </th>
              )}
              <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort('fullName')}>
                <span className="flex items-center gap-1">Name <SortIcon column="fullName" /></span>
              </th>
              <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort('email')}>
                <span className="flex items-center gap-1">Email <SortIcon column="email" /></span>
              </th>
              <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort('department')}>
                <span className="flex items-center gap-1">Department <SortIcon column="department" /></span>
              </th>
              <th className="px-4 py-3 text-left">Templates</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="rounded"
                    />
                  </td>
                )}
                <td className="px-4 py-3 font-medium">{user.fullName || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-gray-600">{user.department || '—'}</td>
                <td className="px-4 py-3">
                  {user.assignments?.map((a) => (
                    <Badge key={a.template.id} variant="secondary" className="mr-1">
                      {a.template.name}
                    </Badge>
                  ))}
                  {(!user.assignments || user.assignments.length === 0) && (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.isActive ? 'success' : 'destructive'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={selectable ? 6 : 5} className="px-4 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}