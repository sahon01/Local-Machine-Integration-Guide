'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AgentConfig {
  id: string;
  name: string;
  type: string;
  systemPrompt: string;
  tools: string[];
  model: string;
  temperature: number;
  maxTokens: number;
}

export default function AgentEditorPage() {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<AgentConfig | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        const agentList = data.agents || [];
        setAgents(agentList);
        if (agentList.length > 0) {
          setSelectedAgent(agentList[0]);
          setFormData(agentList[0]);
        }
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    };

    fetchAgents();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
    if (selectedAgent) {
      setFormData({ ...selectedAgent });
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/agents/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSelectedAgent(formData);
        setAgents((prev) =>
          prev.map((a) => (a.id === formData.id ? formData : a))
        );
        setEditMode(false);
      }
    } catch (error) {
      console.error('Failed to save agent:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(selectedAgent);
  };

  const handleFieldChange = (field: keyof AgentConfig, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  return (
    <div className="flex gap-4 h-screen p-4 bg-background">
      {/* Agents List */}
      <div className="w-64 flex flex-col border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Agents</h3>
          <p className="text-xs text-muted-foreground mt-1">Configuration Editor</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-4">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => {
                  setSelectedAgent(agent);
                  setFormData(agent);
                  setEditMode(false);
                }}
                className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                  selectedAgent?.id === agent.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="font-medium">{agent.name}</div>
                <Badge variant="outline" className="mt-1 text-xs">
                  {agent.type}
                </Badge>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col gap-4">
        {selectedAgent && formData ? (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{selectedAgent.name}</h2>
                <p className="text-sm text-muted-foreground">Edit agent configuration</p>
              </div>
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit}>Edit Agent</Button>
                )}
              </div>
            </div>

            <Tabs defaultValue="basic" className="flex-1 flex flex-col">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="prompt">System Prompt</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="flex-1">
                <Card className="p-6 space-y-4 h-full overflow-y-auto">
                  <div>
                    <label className="text-sm font-medium">Agent Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      disabled={!editMode}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Input
                      value={formData.type}
                      onChange={(e) => handleFieldChange('type', e.target.value)}
                      disabled={!editMode}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Model</label>
                    <Input
                      value={formData.model}
                      onChange={(e) => handleFieldChange('model', e.target.value)}
                      disabled={!editMode}
                      className="mt-1"
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="prompt" className="flex-1">
                <Card className="p-6 h-full overflow-y-auto">
                  <label className="text-sm font-medium block mb-2">System Prompt</label>
                  <Textarea
                    value={formData.systemPrompt}
                    onChange={(e) => handleFieldChange('systemPrompt', e.target.value)}
                    disabled={!editMode}
                    className="min-h-96 resize-none"
                    placeholder="Enter the system prompt for this agent..."
                  />
                </Card>
              </TabsContent>

              <TabsContent value="parameters" className="flex-1">
                <Card className="p-6 space-y-4 h-full overflow-y-auto">
                  <div>
                    <label className="text-sm font-medium">Temperature</label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) => handleFieldChange('temperature', parseFloat(e.target.value))}
                        disabled={!editMode}
                        className="flex-1"
                      />
                      <span className="w-12 text-right">{formData.temperature.toFixed(1)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Tokens</label>
                    <Input
                      type="number"
                      value={formData.maxTokens}
                      onChange={(e) => handleFieldChange('maxTokens', parseInt(e.target.value))}
                      disabled={!editMode}
                      className="mt-1"
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="tools" className="flex-1">
                <Card className="p-6 h-full overflow-y-auto">
                  <label className="text-sm font-medium block mb-2">Available Tools</label>
                  <div className="space-y-2">
                    {formData.tools.map((tool, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-muted rounded"
                      >
                        <span className="text-sm">{tool}</span>
                        {editMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newTools = formData.tools.filter((_, i) => i !== index);
                              handleFieldChange('tools', newTools);
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="flex items-center justify-center h-full text-muted-foreground">
            Select an agent to edit
          </Card>
        )}
      </div>
    </div>
  );
}
