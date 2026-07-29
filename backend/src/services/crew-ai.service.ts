import { MemoryService } from './memory.service.js';
import { LLMService } from './llm.service.js';

interface Agent {
  name: string;
  role: string;
  goal: string;
  backstory: string;
  tools: string[];
  memory: any;
}

interface Task {
  description: string;
  expectedOutput: string;
  agent: Agent;
}

interface CrewState {
  agentId: string;
  tasksCompleted: string[];
  currentTask: string | null;
  state: Record<string, any>;
}

export class CrewAIService {
  private memoryService: MemoryService;
  private llmService: LLMService;
  private crewStates: Map<string, CrewState>;

  constructor(dbPath: string, llmService: LLMService) {
    this.memoryService = new MemoryService(dbPath);
    this.llmService = llmService;
    this.crewStates = new Map();
  }

  /**
   * Create an agent configuration for CrewAI
   */
  createAgentConfig(
    name: string,
    role: string,
    goal: string,
    backstory: string,
    tools: string[] = []
  ): Agent {
    return {
      name,
      role,
      goal,
      backstory,
      tools,
      memory: {
        short_term: [],
        long_term: [],
        entityMemory: {},
      },
    };
  }

  /**
   * Create a task for the crew
   */
  createTask(
    description: string,
    expectedOutput: string,
    agent: Agent
  ): Task {
    return {
      description,
      expectedOutput,
      agent,
    };
  }

  /**
   * Execute a task with the agent using crew-like coordination
   */
  async executeTask(agentId: string, task: Task): Promise<{
    output: string;
    memoryId: string;
    executionTime: number;
  }> {
    const startTime = Date.now();

    // Retrieve agent context from memory
    const contextMemories = this.memoryService.retrieveMemories(
      agentId,
      'context',
      5
    );
    const context = contextMemories.map((m) => m.content).join('\n');

    // Retrieve relevant past conversations
    const conversationMemories = this.memoryService.retrieveMemories(
      agentId,
      'conversation',
      3
    );

    // Build the prompt with context
    const systemPrompt = `
You are an AI Agent with the following configuration:
- Role: ${task.agent.role}
- Goal: ${task.agent.goal}
- Backstory: ${task.agent.backstory}

Relevant Context:
${context}

Past Interactions:
${conversationMemories.map((m) => m.content).join('\n\n')}

You have the following tools available: ${task.agent.tools.join(', ')}

Execute the following task and provide a clear, detailed output:
Task: ${task.description}
Expected Output Format: ${task.expectedOutput}
`;

    // Execute using LLM service
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt,
      },
      {
        role: 'user' as const,
        content: task.description,
      },
    ];

    const response = await this.llmService.createCompletion(
      'gpt-4',
      messages,
      {
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    const output = response.choices?.[0]?.message?.content || 'No output';
    const executionTime = Date.now() - startTime;

    // Store task execution in memory
    const memoryId = this.memoryService.addMemory(
      agentId,
      'task',
      `Task: ${task.description}\n\nOutput: ${output}`,
      {
        taskDescription: task.description,
        expectedOutput: task.expectedOutput,
        executionTime,
      },
      0.8
    );

    // Store the output as a learning
    this.memoryService.addMemory(
      agentId,
      'learning',
      `Learned from task execution: ${output.substring(0, 200)}...`,
      { taskId: memoryId },
      0.7
    );

    return {
      output,
      memoryId,
      executionTime,
    };
  }

  /**
   * Orchestrate multiple agents working together
   */
  async orchestrateAgents(
    agentConfigs: Agent[],
    tasks: Task[]
  ): Promise<{
    results: Array<{ agentId: string; output: string }>;
    totalExecutionTime: number;
    coordinationData: any;
  }> {
    const startTime = Date.now();
    const results: Array<{ agentId: string; output: string }> = [];

    // Simple sequential orchestration (can be enhanced for parallel execution)
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const agent = agentConfigs[i % agentConfigs.length];

      try {
        const execution = await this.executeTask(agent.name, task);
        results.push({
          agentId: agent.name,
          output: execution.output,
        });

        // Create relationships between memories for coordination
        if (results.length > 1) {
          const previousMemoryId = results[results.length - 2];
          this.memoryService.createRelationship(
            previousMemoryId as any,
            execution.memoryId,
            'depends_on',
            0.8
          );
        }
      } catch (error) {
        console.error(`Failed to execute task for agent ${agent.name}:`, error);
      }
    }

    return {
      results,
      totalExecutionTime: Date.now() - startTime,
      coordinationData: {
        agentsUsed: agentConfigs.length,
        tasksExecuted: results.length,
        taskOrder: results.map((r) => r.agentId),
      },
    };
  }

  /**
   * Get agent state and memory summary
   */
  getAgentState(agentId: string) {
    const state = this.crewStates.get(agentId) || {
      agentId,
      tasksCompleted: [],
      currentTask: null,
      state: {},
    };

    const memoryStats = this.memoryService.getMemoryStats(agentId);
    const recentMemories = this.memoryService.retrieveMemories(agentId, undefined, 5);

    return {
      state,
      memoryStats,
      recentActivities: recentMemories.map((m) => ({
        type: m.type,
        content: m.content.substring(0, 100),
        importance: m.importance,
        timestamp: m.createdAt,
      })),
    };
  }

  /**
   * Reset agent memory
   */
  resetAgentMemory(agentId: string) {
    this.memoryService.clearMemories(agentId);
    this.crewStates.delete(agentId);
  }
}
