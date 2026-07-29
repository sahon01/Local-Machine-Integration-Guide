'use client';

import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export function AdminNavbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <span className="text-white font-bold">Z</span>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">ZombieCoder Admin</h2>
          <p className="text-xs text-gray-500">Control Panel</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <User className="h-4 w-4 text-gray-600" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </nav>
  );
}
