import axios, { AxiosInstance } from 'axios';
import Database from 'better-sqlite3';

const db = new Database(process.env.DATABASE_PATH || './data/zombiecoder.db');

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface StreamChunk {
  choices: Array<{
    index: number;
    delta: {
      content?: string;
      role?: string;
    };
  }>;
}

export class LLMProvider {
  private client: AxiosInstance;
  private providerId: string;
  private baseURL: string;
  private apiKey: string;
  private type: string;
  
  constructor(providerId: string, baseURL: string, apiKey: string, type: string) {
    this.providerId = providerId;
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.type = type;
    
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }
  
  /**
   * Get list of available models from provider
   */
  async getModels(): Promise<any[]> {
    try {
      const response = await this.client.get('/models');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch models: ${error.message}`);
    }
  }
  
  /**
   * Send chat completion request
   */
  async chatCompletion(
    messages: ChatMessage[],
    model: string,
    options?: {
      temperature?: number;
      top_p?: number;
      max_tokens?: number;
      stop?: string[];
    }
  ): Promise<ChatCompletionResponse> {
    try {
      const payload = {
        model,
        messages,
        temperature: options?.temperature ?? 0.7,
        top_p: options?.top_p ?? 0.9,
        max_tokens: options?.max_tokens ?? 2048,
        ...(options?.stop && { stop: options.stop })
      };
      
      const response = await this.client.post('/chat/completions', payload);
      
      // Log request
      this.logRequest(model, messages, response.data.usage || {});
      
      return response.data;
    } catch (error: any) {
      throw new Error(`Chat completion failed: ${error.message}`);
    }
  }
  
  /**
   * Stream chat completion response
   */
  async *streamChatCompletion(
    messages: ChatMessage[],
    model: string,
    options?: {
      temperature?: number;
      top_p?: number;
      max_tokens?: number;
    }
  ): AsyncGenerator<string> {
    try {
      const payload = {
        model,
        messages,
        stream: true,
        temperature: options?.temperature ?? 0.7,
        top_p: options?.top_p ?? 0.9,
        max_tokens: options?.max_tokens ?? 2048
      };
      
      const response = await this.client.post('/chat/completions', payload, {
        responseType: 'stream'
      });
      
      for await (const chunk of response.data) {
        const text = chunk.toString();
        
        if (text.startsWith('data: ')) {
          const jsonStr = text.slice(6);
          
          if (jsonStr === '[DONE]') {
            break;
          }
          
          try {
            const json = JSON.parse(jsonStr);
            const content = json.choices[0]?.delta?.content || '';
            if (content) {
              yield content;
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    } catch (error: any) {
      throw new Error(`Stream failed: ${error.message}`);
    }
  }
  
  /**
   * Check provider health
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/models');
      return response.status === 200 && Array.isArray(response.data.data);
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Log API request for analytics
   */
  private logRequest(model: string, messages: ChatMessage[], usage: any): void {
    try {
      const modelRecord: any = db.prepare('SELECT id FROM models WHERE model_id = ?').get(model);
      
      if (modelRecord) {
        db.prepare(`
          INSERT INTO api_requests (
            id, endpoint, method, status_code, response_time_ms, 
            tokens_used, model_id, metadata, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).run(
          require('uuid').v4(),
          '/chat/completions',
          'POST',
          200,
          0,
          usage.total_tokens || 0,
          modelRecord.id,
          JSON.stringify({ provider: this.type })
        );
      }
    } catch (error) {
      console.error('Failed to log API request:', error);
    }
  }
}

/**
 * Factory to create provider instances
 */
export class LLMProviderFactory {
  static createProvider(providerId: string): LLMProvider {
    const provider: any = db.prepare('SELECT * FROM providers WHERE id = ?').get(providerId);
    
    if (!provider) {
      throw new Error('Provider not found');
    }
    
    if (!provider.is_active) {
      throw new Error('Provider is not active');
    }
    
    return new LLMProvider(
      provider.id,
      provider.api_url,
      provider.api_key,
      provider.type
    );
  }
  
  static createProviderFromUrl(apiUrl: string, apiKey: string, type: string = 'openai'): LLMProvider {
    return new LLMProvider('custom', apiUrl, apiKey, type);
  }
  
  static async testConnection(apiUrl: string, apiKey: string): Promise<boolean> {
    try {
      const provider = new LLMProvider('test', apiUrl, apiKey, 'test');
      return await provider.healthCheck();
    } catch (error) {
      return false;
    }
  }
}

export default LLMProvider;
