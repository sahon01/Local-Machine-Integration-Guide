'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  Users,
  Zap,
  Server,
  Brain,
  MessageSquare,
  Database,
  BarChart3,
  GitBranch,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Providers', href: '/admin/providers', icon: Zap },
  { label: 'Models', href: '/admin/models', icon: Brain },
  { label: 'Agents', href: '/admin/agents', icon: GitBranch },
  { label: 'Servers', href: '/admin/servers', icon: Server },
  { label: 'Tools', href: '/admin/tools', icon: Settings },
  { label: 'Memory', href: '/admin/memory-management', icon: Database },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Chat', href: '/chat', icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">ZombieCoder</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400">ZombieCoder v1.0.0</p>
          <p className="text-xs text-gray-500 mt-1">Production Ready</p>
        </div>
      </div>
    </aside>
  );
}
