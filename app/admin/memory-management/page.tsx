'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MemoryEntry {
  id: string;
  type: string;
  content: string;
  importance: number;
  accessCount: number;
  createdAt: number;
}

interface MemoryStats {
  totalEntries: number;
  avgImportance: number;
  maxImportance: number;
  uniqueTypes: number;
  totalAccesses: number;
}

export default function MemoryManagementPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [newMemory, setNewMemory] = useState({
    type: 'learning',
    content: '',
    importance: 0.5,
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        const agentList = data.agents || [];
        setAgents(agentList);
        if (agentList.length > 0) {
          setSelectedAgentId(agentList[0].id);
          await loadMemories(agentList[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    };

    fetchAgents();
  }, []);

  const loadMemories = async (agentId: string) => {
    try {
      const [memoriesRes, statsRes] = await Promise.all([
        fetch(`/api/memory/entries/${agentId}`),
        fetch(`/api/memory/stats/${agentId}`),
      ]);

      const memoriesData = await memoriesRes.json();
      const statsData = await statsRes.json();

      setMemories(memoriesData.memories || []);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load memories:', error);
    }
  };

  const handleAddMemory = async () => {
    if (!selectedAgentId || !newMemory.content) return;

    try {
      const response = await fetch('/api/memory/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgentId,
          ...newMemory,
        }),
      });

      if (response.ok) {
        setNewMemory({ type: 'learning', content: '', importance: 0.5 });
        await loadMemories(selectedAgentId);
      }
    } catch (error) {
      console.error('Failed to add memory:', error);
    }
  };

  const handleClearMemories = async () => {
    if (!selectedAgentId || !confirm('Clear all memories for this agent?')) return;

    try {
      const response = await fetch(`/api/memory/${selectedAgentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadMemories(selectedAgentId);
      }
    } catch (error) {
      console.error('Failed to clear memories:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conversation':
        return 'bg-blue-100 text-blue-800';
      case 'context':
        return 'bg-green-100 text-green-800';
      case 'task':
        return 'bg-purple-100 text-purple-800';
      case 'learning':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-background">
      <div>
        <h1 className="text-3xl font-bold">Memory Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage agent memory entries, conversations, and learning records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Agent Selection */}
        <Card className="lg:col-span-1 p-4">
          <h3 className="font-semibold mb-3">Agents</h3>
          <div className="space-y-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => {
                  setSelectedAgentId(agent.id);
                  loadMemories(agent.id);
                }}
                className={`w-full text-left p-2 rounded text-sm transition-colors ${
                  selectedAgentId === agent.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                {agent.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Total Entries</p>
                <p className="text-lg font-bold">{stats.totalEntries}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Avg Importance</p>
                <p className="text-lg font-bold">{stats.avgImportance.toFixed(2)}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Max Importance</p>
                <p className="text-lg font-bold">{stats.maxImportance.toFixed(2)}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Unique Types</p>
                <p className="text-lg font-bold">{stats.uniqueTypes}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Total Accesses</p>
                <p className="text-lg font-bold">{stats.totalAccesses}</p>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="memories" className="w-full">
            <TabsList>
              <TabsTrigger value="memories">Memory Entries</TabsTrigger>
              <TabsTrigger value="add">Add Memory</TabsTrigger>
            </TabsList>

            {/* Memory Entries */}
            <TabsContent value="memories">
              <Card className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {memories.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No memories found</p>
                ) : (
                  memories.map((memory) => (
                    <div
                      key={memory.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <Badge className={getTypeColor(memory.type)}>
                          {memory.type}
                        </Badge>
                        <Badge variant="outline">
                          Access: {memory.accessCount}
                        </Badge>
                      </div>
                      <p className="text-sm">{memory.content}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Importance</span>
                          <span>{memory.importance.toFixed(2)}</span>
                        </div>
                        <Progress value={memory.importance * 100} className="h-2" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(memory.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </Card>
            </TabsContent>

            {/* Add Memory */}
            <TabsContent value="add">
              <Card className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Memory Type</label>
                  <select
                    value={newMemory.type}
                    onChange={(e) =>
                      setNewMemory({ ...newMemory, type: e.target.value })
                    }
                    className="w-full border rounded p-2 mt-1 text-sm"
                  >
                    <option value="conversation">Conversation</option>
                    <option value="context">Context</option>
                    <option value="task">Task</option>
                    <option value="learning">Learning</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newMemory.content}
                    onChange={(e) =>
                      setNewMemory({ ...newMemory, content: e.target.value })
                    }
                    placeholder="Enter memory content..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Importance</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={newMemory.importance}
                      onChange={(e) =>
                        setNewMemory({
                          ...newMemory,
                          importance: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1"
                    />
                    <span className="w-12 text-right text-sm">
                      {newMemory.importance.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddMemory}
                    disabled={!newMemory.content}
                    className="flex-1"
                  >
                    Add Memory
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleClearMemories}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
