'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  Send,
  Megaphone,
  Settings,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/templates', label: 'Templates', icon: FileText },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/deploy', label: 'Deploy', icon: Send },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">DWiseStamp</h1>
        <p className="text-sm text-gray-400 mt-1">Signature Manager</p>
      </div>
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-active text-white'
                  : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">Develeap Workspace</p>
      </div>
    </aside>
  );
}