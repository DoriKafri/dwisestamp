'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface UserFiltersProps {
  departments: string[];
  selectedDepartment?: string;
  onDepartmentChange: (dept: string | undefined) => void;
  showActiveOnly: boolean;
  onActiveToggle: () => void;
}

export function UserFilters({
  departments,
  selectedDepartment,
  onDepartmentChange,
  showActiveOnly,
  onActiveToggle,
}: UserFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select
        value={selectedDepartment || ''}
        onChange={(e) => onDepartmentChange(e.target.value || undefined)}
        className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm"
      >
        <option value="">All Departments</option>
        {departments.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <Button
        variant={showActiveOnly ? 'default' : 'outline'}
        size="sm"
        onClick={onActiveToggle}
      >
        {showActiveOnly ? 'Active Only' : 'All Users'}
      </Button>
    </div>
  );
}