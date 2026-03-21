import express from 'express';
import { db } from '../db/database.js';
import { verifyToken } from '../middleware/auth.js';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const MessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

const ChatCompletionSchema = z.object({
  provider_id: z.string().optional(),
  provider_name: z.string().optional(),
  model: z.string(),
  messages: z.array(MessageSchema),
  temperature: z.number().min(0).max(2).default(0.7),
  top_p: z.number().min(0).max(1).default(1),
  max_tokens: z.number().positive().default(2048),
  stream: z.boolean().default(false),
  stop: z.array(z.string()).optional(),
  frequency_penalty: z.number().min(-2).max(2).optional(),
  presence_penalty: z.number().min(-2).max(2).optional(),
});

type ChatCompletionRequest = z.infer<typeof ChatCompletionSchema>;

// Helper: Get provider by ID or name
async function getProvider(providerId?: string, providerName?: string) {
  let provider;

  if (providerId) {
    provider = db.getProvider(providerId);
  } else if (providerName) {
    const providers = db.getProviders();
    provider = providers.find(p => p.name.toLowerCase() === providerName.toLowerCase());
  } else {
    const providers = db.getProviders();
    provider = providers.find(p => p.is_default);
  }

  if (!provider) {
    throw new Error('Provider not found or not configured');
  }

  return provider;
}

// Helper: Get model details
function getModel(providerId: string, modelId: string) {
  const models = db.getModels();
  return models.find(m => m.provider_id === providerId && m.model_id === modelId);
}

// Helper: Make OpenAI-compatible API call
async function makeOpenAICall(
  provider: any,
  model: string,
  messages: Array<{ role: string; content: string }>,
  params: any,
  stream: boolean = false
) {
  const baseURL = provider.api_url || 'https://api.openai.com/v1';
  const apiKey = provider.api_key;

  const body = {
    model,
    messages,
    temperature: params.temperature,
    top_p: params.top_p,
    max_tokens: params.max_tokens,
    stream,
    ...(params.stop && { stop: params.stop }),
    ...(params.frequency_penalty && { frequency_penalty: params.frequency_penalty }),
    ...(params.presence_penalty && { presence_penalty: params.presence_penalty }),
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Handle different provider auth methods
  if (provider.type === 'openai') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  } else if (provider.type === 'gemini') {
    // Gemini uses API key in query params
    return fetch(`${baseURL}/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } else if (provider.type === 'ollama') {
    // Ollama doesn't need auth
    delete headers['Authorization'];
  }

  const endpoint = `${baseURL}/chat/completions`;

  return fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

// POST /api/completions/chat/completions
router.post('/chat/completions', verifyToken, async (req, res) => {
  try {
    const data = ChatCompletionSchema.parse(req.body);

    // Get provider
    const provider = await getProvider(data.provider_id, data.provider_name);

    // Validate model exists (if model is from provider)
    const modelInfo = getModel(provider.id, data.model);
    if (modelInfo && !modelInfo.is_active) {
      return res.status(400).json({
        error: {
          message: 'Model is not active',
          type: 'invalid_request_error',
        },
      });
    }

    // Log request
    db.recordAPIRequest({
      user_id: (req as any).user?.id || 'unknown',
      provider_id: provider.id,
      model_id: data.model,
      request_type: 'chat_completion',
      tokens_used: 0, // Will update after response
      response_time: 0, // Will update after response
      status_code: 200,
      error_message: null,
    });

    // Make API call
    const response = await makeOpenAICall(
      provider,
      data.model,
      data.messages,
      {
        temperature: data.temperature,
        top_p: data.top_p,
        max_tokens: data.max_tokens,
        stop: data.stop,
        frequency_penalty: data.frequency_penalty,
        presence_penalty: data.presence_penalty,
      },
      data.stream
    );

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({
        error: {
          message: error.error?.message || 'API Error',
          type: error.error?.type || 'api_error',
        },
      });
    }

    if (data.stream) {
      // Handle streaming response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        return res.status(500).json({ error: 'Failed to stream response' });
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              res.write(`${line}\n`);
            }
          }
        }
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (error) {
        console.error('[ZombieCoder] Stream error:', error);
        res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
        res.end();
      }
    } else {
      // Handle non-streaming response
      const responseData = await response.json();
      res.json(responseData);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: {
          message: 'Invalid request format',
          type: 'invalid_request_error',
          details: error.errors,
        },
      });
    }

    if (error instanceof Error && error.message.includes('Provider not found')) {
      return res.status(404).json({
        error: {
          message: error.message,
          type: 'not_found',
        },
      });
    }

    console.error('[ZombieCoder] Completion error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        type: 'server_error',
      },
    });
  }
});

// GET /api/completions/models
router.get('/models', verifyToken, async (req, res) => {
  try {
    const models = db.getModels();
    const providers = db.getProviders();

    const enrichedModels = models
      .filter(m => {
        const provider = providers.find(p => p.id === m.provider_id);
        return provider && provider.is_active;
      })
      .map(m => {
        const provider = providers.find(p => p.id === m.provider_id);
        return {
          id: m.id,
          name: m.name || m.model_id,
          model_id: m.model_id,
          provider_id: m.provider_id,
          provider_name: provider?.name,
          context_window: m.context_window,
          max_tokens: m.max_tokens,
          is_active: m.is_active,
          is_default: m.is_default,
          created_at: m.created_at,
        };
      });

    res.json({
      success: true,
      data: enrichedModels,
      count: enrichedModels.length,
    });
  } catch (error) {
    console.error('[ZombieCoder] Models fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch models',
    });
  }
});

// GET /api/completions/models/:modelId
router.get('/models/:modelId', verifyToken, async (req, res) => {
  try {
    const models = db.getModels();
    const providers = db.getProviders();

    const model = models.find(m => m.id === req.params.modelId || m.model_id === req.params.modelId);

    if (!model) {
      return res.status(404).json({
        success: false,
        error: 'Model not found',
      });
    }

    const provider = providers.find(p => p.id === model.provider_id);

    res.json({
      success: true,
      data: {
        id: model.id,
        name: model.name || model.model_id,
        model_id: model.model_id,
        provider_id: model.provider_id,
        provider_name: provider?.name,
        context_window: model.context_window,
        max_tokens: model.max_tokens,
        is_active: model.is_active,
        is_default: model.is_default,
        created_at: model.created_at,
      },
    });
  } catch (error) {
    console.error('[ZombieCoder] Model fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch model',
    });
  }
});

// POST /api/completions/embeddings
router.post('/embeddings', verifyToken, async (req, res) => {
  try {
    const { input, model, provider_id, provider_name } = req.body;

    if (!input || !model) {
      return res.status(400).json({
        error: {
          message: 'input and model are required',
          type: 'invalid_request_error',
        },
      });
    }

    const provider = await getProvider(provider_id, provider_name);

    const response = await makeOpenAICall(
      provider,
      model,
      [{ role: 'user', content: Array.isArray(input) ? input[0] : input }],
      { temperature: 0, max_tokens: 1 },
      false
    );

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({
        error: {
          message: error.error?.message || 'API Error',
          type: error.error?.type || 'api_error',
        },
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[ZombieCoder] Embeddings error:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        type: 'server_error',
      },
    });
  }
});

export default router;
