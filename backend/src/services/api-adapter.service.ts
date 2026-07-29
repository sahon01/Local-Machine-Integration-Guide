import { LLMProvider, LLMProviderFactory, ChatMessage, ChatCompletionResponse } from './llm.service.js';
import OllamaService from './ollama.service.js';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

const db = new Database(process.env.DATABASE_PATH || './data/zombiecoder.db');

/**
 * Unified API adapter that normalizes requests across different providers
 * All requests are converted to OpenAI-compatible format
 */
export class UnifiedAPIAdapter {
  private providers: Map<string, LLMProvider | OllamaService> = new Map();
  
  /**
   * Get or initialize provider
   */
  getProvider(providerId: string): LLMProvider | OllamaService {
    if (!this.providers.has(providerId)) {
      const provider: any = db.prepare('SELECT * FROM providers WHERE id = ?').get(providerId);
      
      if (!provider) {
        throw new Error('Provider not found');
      }
      
      if (provider.type === 'ollama') {
        this.providers.set(providerId, new OllamaService(provider.api_url));
      } else {
        this.providers.set(providerId, new LLMProvider(
          provider.id,
          provider.api_url,
          provider.api_key,
          provider.type
        ));
      }
    }
    
    return this.providers.get(providerId)!;
  }
  
  /**
   * List all available models across all active providers
   */
  async getAvailableModels(): Promise<any[]> {
    const providers = db.prepare('SELECT * FROM providers WHERE is_active = 1').all() as any[];
    const models: any[] = [];
    
    for (const provider of providers) {
      try {
        const providerInstance = this.getProvider(provider.id);
        const providerModels = await providerInstance.getModels();
        
        for (const model of providerModels) {
          models.push({
            id: uuidv4(),
            name: this.formatModelName(model, provider.type),
            model_id: model.id || model.name,
            provider_id: provider.id,
            provider_name: provider.name,
            provider_type: provider.type,
            description: model.description || '',
            context_window: model.context_window || 4096,
            created: new Date().toISOString()
          });
        }
      } catch (error: any) {
        console.error(`Failed to fetch models from ${provider.name}:`, error.message);
      }
    }
    
    return models;
  }
  
  /**
   * Chat completion in OpenAI format
   */
  async chatCompletion(
    providerId: string,
    modelId: string,
    messages: ChatMessage[],
    options?: {
      temperature?: number;
      top_p?: number;
      max_tokens?: number;
    }
  ): Promise<ChatCompletionResponse> {
    const provider = this.getProvider(providerId);
    
    if (provider instanceof OllamaService) {
      // Convert to Ollama format
      const response = await provider.chat(modelId, messages as any, options);
      
      return this.formatToOpenAI({
        id: uuidv4(),
        model: modelId,
        message: response
      });
    } else {
      // Direct OpenAI-compatible call
      return provider.chatCompletion(messages, modelId, options);
    }
  }
  
  /**
   * Stream chat completion
   */
  async *streamChatCompletion(
    providerId: string,
    modelId: string,
    messages: ChatMessage[],
    options?: {
      temperature?: number;
      top_p?: number;
      max_tokens?: number;
    }
  ): AsyncGenerator<string> {
    const provider = this.getProvider(providerId);
    
    if (provider instanceof OllamaService) {
      yield* provider.streamChat(modelId, messages as any, options);
    } else {
      yield* provider.streamChatCompletion(messages, modelId, options);
    }
  }
  
  /**
   * Sync models from provider to database
   */
  async syncModelsFromProvider(providerId: string): Promise<number> {
    const provider: any = db.prepare('SELECT * FROM providers WHERE id = ?').get(providerId);
    
    if (!provider) {
      throw new Error('Provider not found');
    }
    
    try {
      const providerInstance = this.getProvider(providerId);
      const models = await providerInstance.getModels();
      
      let synced = 0;
      
      for (const model of models) {
        const modelId = model.id || model.name;
        
        // Check if model exists
        const existing = db.prepare('SELECT id FROM models WHERE provider_id = ? AND model_id = ?')
          .get(providerId, modelId);
        
        if (!existing) {
          db.prepare(`
            INSERT INTO models (
              id, provider_id, name, display_name, model_id, 
              is_active, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
          `).run(
            uuidv4(),
            providerId,
            this.formatModelName(model, provider.type),
            this.formatModelName(model, provider.type),
            modelId
          );
          
          synced++;
        }
      }
      
      return synced;
    } catch (error: any) {
      throw new Error(`Failed to sync models: ${error.message}`);
    }
  }
  
  /**
   * Format model name consistently
   */
  private formatModelName(model: any, providerType: string): string {
    const baseName = model.name || model.id || 'unknown';
    
    if (providerType === 'ollama') {
      return baseName.split(':')[0]; // Remove tag from ollama models
    }
    
    return baseName;
  }
  
  /**
   * Format response to OpenAI format
   */
  private formatToOpenAI(response: any): ChatCompletionResponse {
    return {
      id: response.id,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: response.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: response.message || ''
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };
  }
}

export default new UnifiedAPIAdapter();
