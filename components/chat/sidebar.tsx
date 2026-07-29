'use client';

import { Button } from '@/components/ui/button';
import { Plus, Search, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
}

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  return (
    <div className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-4">ZombieCoder</h1>
        <Button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 rounded-lg"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="p-4 space-y-2 border-b border-gray-200">
        <div className="text-xs font-semibold text-gray-600 uppercase">Tools</div>
        <Button variant="ghost" className="w-full justify-start text-sm">
          Images
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm">
          Apps
        </Button>
        <Button variant="ghost" className="w-full justify-start text-sm">
          Codex
        </Button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-xs font-semibold text-gray-600 uppercase mb-3">History</div>
        {conversations.length === 0 ? (
          <p className="text-sm text-gray-500">No conversations yet</p>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                  currentConversationId === conv.id
                    ? 'bg-gray-300 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="truncate">{conv.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(conv.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
