'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline';
  model: string;
}

export default function AgentChatPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch agents on mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/agents');
        const data = await response.json();
        setAgents(data.agents || []);
        if (data.agents?.length > 0) {
          setSelectedAgent(data.agents[0]);
        }
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    };

    fetchAgents();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedAgent || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/completions/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedAgent.model || 'gpt-4',
          messages: [
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            { role: 'user', content: userMessage.content },
          ],
          stream: false,
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: data.choices?.[0]?.message?.content || 'No response received',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: 'Error: Failed to get response from agent',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen gap-4 p-4 bg-background">
      {/* Agents Sidebar */}
      <div className="w-64 flex flex-col border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Active Agents</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-2 p-4">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => {
                  setSelectedAgent(agent);
                  setMessages([]);
                }}
                className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                  selectedAgent?.id === agent.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="font-medium">{agent.name}</div>
                <div className="text-xs opacity-70">{agent.model}</div>
                <Badge variant="outline" className="mt-1 text-xs">
                  {agent.status}
                </Badge>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col gap-4">
        {selectedAgent ? (
          <>
            {/* Header */}
            <Card className="p-4">
              <h2 className="font-bold text-lg">{selectedAgent.name}</h2>
              <p className="text-sm text-muted-foreground">Model: {selectedAgent.model}</p>
            </Card>

            {/* Messages */}
            <Card className="flex-1 p-4 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Start a conversation with {selectedAgent.name}
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p className="text-xs opacity-60 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted px-4 py-2 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
            </Card>

            {/* Input Area */}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message... (Shift+Enter for new line)"
                className="resize-none h-24"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="self-end"
              >
                Send
              </Button>
            </div>
          </>
        ) : (
          <Card className="flex items-center justify-center h-full text-muted-foreground">
            Select an agent to start chatting
          </Card>
        )}
      </div>
    </div>
  );
}
