import axios, { AxiosInstance } from 'axios';

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class OllamaService {
  private client: AxiosInstance;
  private baseURL: string;
  
  constructor(baseURL: string = 'http://localhost:11434') {
    this.baseURL = baseURL;
    
    this.client = axios.create({
      baseURL,
      timeout: 60000
    });
  }
  
  /**
   * Get list of available local models
   */
  async getModels(): Promise<OllamaModel[]> {
    try {
      const response = await this.client.get('/api/tags');
      return response.data.models || [];
    } catch (error: any) {
      throw new Error(`Failed to fetch Ollama models: ${error.message}`);
    }
  }
  
  /**
   * Check if Ollama service is running
   */
  async isRunning(): Promise<boolean> {
    try {
      await this.client.get('/api/tags');
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Generate text completion
   */
  async generate(
    model: string,
    prompt: string,
    options?: {
      temperature?: number;
      top_k?: number;
      top_p?: number;
    }
  ): Promise<string> {
    try {
      const response = await this.client.post('/api/generate', {
        model,
        prompt,
        stream: false,
        ...options
      });
      
      return response.data.response;
    } catch (error: any) {
      throw new Error(`Ollama generation failed: ${error.message}`);
    }
  }
  
  /**
   * Stream text generation
   */
  async *streamGenerate(
    model: string,
    prompt: string,
    options?: {
      temperature?: number;
      top_k?: number;
      top_p?: number;
    }
  ): AsyncGenerator<string> {
    try {
      const response = await this.client.post('/api/generate', {
        model,
        prompt,
        stream: true,
        ...options
      }, {
        responseType: 'stream'
      });
      
      for await (const chunk of response.data) {
        try {
          const json = JSON.parse(chunk.toString());
          if (json.response) {
            yield json.response;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    } catch (error: any) {
      throw new Error(`Ollama streaming failed: ${error.message}`);
    }
  }
  
  /**
   * Chat completion (OpenAI-compatible format)
   */
  async chat(
    model: string,
    messages: OllamaMessage[],
    options?: {
      temperature?: number;
      top_k?: number;
      top_p?: number;
    }
  ): Promise<string> {
    try {
      const response = await this.client.post('/api/chat', {
        model,
        messages,
        stream: false,
        ...options
      });
      
      return response.data.message.content;
    } catch (error: any) {
      throw new Error(`Ollama chat failed: ${error.message}`);
    }
  }
  
  /**
   * Stream chat completion
   */
  async *streamChat(
    model: string,
    messages: OllamaMessage[],
    options?: {
      temperature?: number;
      top_k?: number;
      top_p?: number;
    }
  ): AsyncGenerator<string> {
    try {
      const response = await this.client.post('/api/chat', {
        model,
        messages,
        stream: true,
        ...options
      }, {
        responseType: 'stream'
      });
      
      for await (const chunk of response.data) {
        try {
          const json = JSON.parse(chunk.toString());
          if (json.message?.content) {
            yield json.message.content;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    } catch (error: any) {
      throw new Error(`Ollama chat streaming failed: ${error.message}`);
    }
  }
  
  /**
   * Pull model from registry
   */
  async pullModel(model: string): Promise<void> {
    try {
      await this.client.post('/api/pull', { name: model });
    } catch (error: any) {
      throw new Error(`Failed to pull model: ${error.message}`);
    }
  }
  
  /**
   * Delete model from local storage
   */
  async deleteModel(model: string): Promise<void> {
    try {
      await this.client.delete('/api/delete', { data: { name: model } });
    } catch (error: any) {
      throw new Error(`Failed to delete model: ${error.message}`);
    }
  }
  
  /**
   * Convert Ollama to OpenAI compatible format
   */
  toOpenAIFormat(model: string): any {
    return {
      id: model.replace(':', '-'),
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'ollama',
      permission: [],
      root: model,
      parent: null
    };
  }
}

export default OllamaService;
