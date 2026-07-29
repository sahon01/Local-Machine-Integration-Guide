# Critical Issue #3: AI Provider Integration - Real Implementation

**Status:** PARTIAL / BROKEN  
**Priority:** CRITICAL  
**Impact:** Cannot use any AI providers for chat completions  
**Last Updated:** April 14, 2026

---

## Problem Statement

The system claims to support OpenAI, Ollama, and Google Gemini, but **actual provider integration has NOT been verified**. The provider service layer exists but functionality is unclear.

### Specific Issues

1. **OpenAI Integration**
   - File exists: `backend/src/services/llm.service.ts`
   - **Problem:** API endpoint calls not tested
   - **Risk:** Cannot use OpenAI models

2. **Ollama Local Connection**
   - File exists: `backend/src/services/ollama.service.ts`
   - **Problem:** No connection retry or error handling
   - **Risk:** Crashes if Ollama is not running

3. **Google Gemini Support**
   - **Problem:** Different API format, adapter needed
   - **Risk:** Cannot use Gemini models at all

4. **Provider Failover**
   - **Problem:** No fallback mechanism
   - **Risk:** Single provider failure blocks all requests

5. **Rate Limiting**
   - **Problem:** Not implemented per provider
   - **Risk:** Account suspension due to rate limit breach

6. **Streaming Responses**
   - **Problem:** Implementation incomplete
   - **Risk:** Chat interface hangs or fails

7. **API Key Management**
   - **Problem:** Keys stored in plain text
   - **Risk:** Security breach exposes all API keys

---

## Current Implementation State

### Files Involved
```
backend/src/services/
  ├── llm.service.ts (OpenAI)
  ├── ollama.service.ts (Ollama)
  ├── api-adapter.service.ts (Adapter pattern)
  └── crew-ai.service.ts (Agent orchestration)

backend/src/routes/
  └── completions.ts (Chat endpoint)
```

### What EXISTS (✅)
- Service file structure
- Basic adapter pattern sketch
- Endpoint definitions

### What's MISSING (❌)
- Functional implementation
- Error handling
- Retry logic
- Rate limiting
- Streaming support
- Failover mechanism
- Health checks

---

## Required Provider Implementations

### 1. OpenAI Adapter

```typescript
// File: backend/src/services/providers/openai.adapter.ts
interface OpenAIConfig {
  apiKey: string;
  baseURL?: string;
}

interface OpenAIRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

class OpenAIAdapter {
  private config: OpenAIConfig;
  private client: any; // OpenAI client

  constructor(config: OpenAIConfig) {
    this.config = config;
    this.client = new OpenAI({ apiKey: config.apiKey });
  }

  async createCompletion(request: OpenAIRequest): Promise<any> {
    try {
      const response = await this.client.chat.completions.create(request);
      return response;
    } catch (error) {
      console.error('[OpenAI] Error:', error);
      throw new ProviderError('OpenAI request failed', 'OPENAI_ERROR');
    }
  }

  async *streamCompletion(request: OpenAIRequest): AsyncIterableIterator<string> {
    try {
      const stream = await this.client.chat.completions.create({
        ...request,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) yield content;
      }
    } catch (error) {
      console.error('[OpenAI Stream] Error:', error);
      throw new ProviderError('OpenAI stream failed', 'OPENAI_STREAM_ERROR');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.models.list();
      return response.data.length > 0;
    } catch (error) {
      return false;
    }
  }
}
```

### 2. Ollama Adapter

```typescript
// File: backend/src/services/providers/ollama.adapter.ts
interface OllamaConfig {
  baseURL: string; // e.g., 'http://localhost:11434'
  timeout?: number;
}

class OllamaAdapter {
  private config: OllamaConfig;
  private maxRetries = 3;

  constructor(config: OllamaConfig) {
    this.config = config;
  }

  async createCompletion(request: any): Promise<any> {
    return this.retryWithBackoff(async () => {
      const response = await fetch(`${this.config.baseURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.statusText}`);
      }

      return response.json();
    });
  }

  async *streamCompletion(request: any): AsyncIterableIterator<string> {
    const response = await fetch(`${this.config.baseURL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...request, stream: true }),
    });

    if (!response.ok) {
      throw new Error(`Ollama stream error: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        for (const line of text.split('\n')) {
          if (line) {
            const json = JSON.parse(line);
            if (json.message?.content) {
              yield json.message.content;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseURL}/api/tags`, {
        timeout: this.config.timeout || 5000,
      });
      return response.ok;
    } catch (error) {
      console.error('[Ollama] Connection test failed:', error);
      return false;
    }
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>
  ): Promise<T> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === this.maxRetries) throw error;

        const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
        console.log(`[Ollama] Retry ${attempt}/${this.maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }
}
```

### 3. Google Gemini Adapter

```typescript
// File: backend/src/services/providers/gemini.adapter.ts
interface GeminiConfig {
  apiKey: string;
  model?: string;
}

class GeminiAdapter {
  private config: GeminiConfig;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(config: GeminiConfig) {
    this.config = config;
  }

  async createCompletion(request: any): Promise<any> {
    const model = this.config.model || 'gemini-pro';
    const url = `${this.baseURL}/${model}:generateContent?key=${this.config.apiKey}`;

    // Convert OpenAI format to Gemini format
    const geminiRequest = this.convertRequest(request);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiRequest),
    });

    if (!response.ok) {
      throw new Error(`Gemini error: ${response.statusText}`);
    }

    return this.convertResponse(await response.json());
  }

  private convertRequest(openaiRequest: any): any {
    const messages = openaiRequest.messages || [];
    return {
      contents: messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        temperature: openaiRequest.temperature,
        maxOutputTokens: openaiRequest.max_tokens,
      },
    };
  }

  private convertResponse(geminiResponse: any): any {
    // Convert Gemini response to OpenAI format
    return {
      choices: [{
        message: {
          content: geminiResponse.candidates[0]?.content?.parts[0]?.text || '',
        },
      }],
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseURL}?key=${this.config.apiKey}`
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
```

---

## Provider Factory & Manager

```typescript
// File: backend/src/services/provider.manager.ts
type ProviderType = 'openai' | 'ollama' | 'gemini';

class ProviderManager {
  private providers: Map<string, any> = new Map();

  registerProvider(id: string, adapter: any): void {
    this.providers.set(id, adapter);
    console.log(`✅ Provider registered: ${id}`);
  }

  async getProvider(id: string): Promise<any> {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`Provider not found: ${id}`);
    }
    return provider;
  }

  async testProvider(id: string): Promise<boolean> {
    const provider = await this.getProvider(id);
    return provider.testConnection();
  }

  async createCompletion(
    providerId: string,
    request: any,
    stream: boolean = false
  ): Promise<any> {
    const provider = await this.getProvider(providerId);
    
    if (stream) {
      return provider.streamCompletion(request);
    }
    
    return provider.createCompletion(request);
  }

  async failoverCompletion(
    providerIds: string[],
    request: any
  ): Promise<any> {
    for (const providerId of providerIds) {
      try {
        return await this.createCompletion(providerId, request);
      } catch (error) {
        console.warn(`[Failover] ${providerId} failed, trying next...`);
      }
    }
    throw new Error('All providers failed');
  }
}
```

---

## Rate Limiting per Provider

```typescript
// File: backend/src/services/rate-limiter.ts
class RateLimiter {
  private limits: Map<string, number> = new Map();
  private timestamps: Map<string, number[]> = new Map();

  constructor(limits: Record<string, number>) {
    // limits: { 'openai': 3500, 'ollama': 0 }
    Object.entries(limits).forEach(([provider, limit]) => {
      this.limits.set(provider, limit);
      this.timestamps.set(provider, []);
    });
  }

  async checkLimit(providerId: string): Promise<boolean> {
    const limit = this.limits.get(providerId);
    if (limit === 0) return true; // No limit

    const now = Date.now();
    const minute = 60 * 1000;
    const timestamps = this.timestamps.get(providerId) || [];

    // Remove old timestamps (older than 1 minute)
    const recent = timestamps.filter(ts => now - ts < minute);

    if (recent.length >= limit) {
      return false;
    }

    recent.push(now);
    this.timestamps.set(providerId, recent);
    return true;
  }
}
```

---

## Verification Checklist

- [ ] OpenAI adapter creates completions
- [ ] OpenAI adapter streams responses
- [ ] Ollama adapter connects to local server
- [ ] Ollama adapter handles connection errors
- [ ] Ollama adapter retries on failure
- [ ] Gemini adapter converts request/response format
- [ ] Provider manager registers all providers
- [ ] Failover mechanism works
- [ ] Rate limiting prevents quota breach
- [ ] Health checks work for each provider

---

## Files to Create

| File | Purpose | Priority |
|------|---------|----------|
| `backend/src/services/providers/openai.adapter.ts` | OpenAI integration | CRITICAL |
| `backend/src/services/providers/ollama.adapter.ts` | Ollama integration | CRITICAL |
| `backend/src/services/providers/gemini.adapter.ts` | Gemini integration | CRITICAL |
| `backend/src/services/provider.manager.ts` | Provider factory | CRITICAL |
| `backend/src/services/rate-limiter.ts` | Rate limiting | HIGH |
| `backend/src/utils/provider.errors.ts` | Error handling | HIGH |

---

## Next Steps

1. Create provider adapters
2. Implement rate limiting
3. Add failover mechanism
4. Test each provider
5. Document provider setup

---

## Related Documentation

- See: `api-reference/completions.md` for API details
- See: `security/api-key-management.md` for key storage
- See: `testing/provider-tests.md` for testing procedures
