# API Testing Guide - ZombieCoder

Complete guide for testing all API endpoints with cURL and Postman examples.

## Authentication

All protected endpoints require JWT token. Get token via login:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zombiecoder.com","password":"password"}'

# Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "user": { "id": "...", "email": "admin@zombiecoder.com", "role": "admin" }
}
```

Use token in Authorization header:
```
Authorization: Bearer <token>
```

## Chat Completions API

### Basic Chat Request
```bash
curl -X POST http://localhost:5000/api/completions/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}],
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

### Streaming Chat Response
```bash
curl -X POST http://localhost:5000/api/completions/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Write a story"}],
    "stream": true
  }'
```

## Agent Management

### List All Agents
```bash
curl http://localhost:5000/api/agents \
  -H "Authorization: Bearer <token>"
```

### Create New Agent
```bash
curl -X POST http://localhost:5000/api/agents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "CustomAgent",
    "type": "chat",
    "model": "gpt-4",
    "systemPrompt": "You are a helpful assistant",
    "tools": ["web_search", "code_execution"],
    "temperature": 0.7,
    "maxTokens": 2000
  }'
```

### Update Agent
```bash
curl -X PUT http://localhost:5000/api/agents/<agent_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "UpdatedName",
    "systemPrompt": "New system prompt"
  }'
```

### Delete Agent
```bash
curl -X DELETE http://localhost:5000/api/agents/<agent_id> \
  -H "Authorization: Bearer <token>"
```

## Provider Management

### List Providers
```bash
curl http://localhost:5000/api/providers \
  -H "Authorization: Bearer <token>"
```

### Add Provider
```bash
curl -X POST http://localhost:5000/api/providers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "OpenAI",
    "type": "openai",
    "apiKey": "sk-...",
    "endpoint": "https://api.openai.com/v1",
    "isActive": true
  }'
```

### Test Provider Connection
```bash
curl -X POST http://localhost:5000/api/providers/<provider_id>/test \
  -H "Authorization: Bearer <token>"
```

## Model Management

### List Available Models
```bash
curl http://localhost:5000/api/models \
  -H "Authorization: Bearer <token>"
```

### Get Model Details
```bash
curl http://localhost:5000/api/models/<model_id> \
  -H "Authorization: Bearer <token>"
```

### Sync Models from Provider
```bash
curl -X POST http://localhost:5000/api/providers/<provider_id>/sync-models \
  -H "Authorization: Bearer <token>"
```

## Server Management

### List Servers
```bash
curl http://localhost:5000/api/servers \
  -H "Authorization: Bearer <token>"
```

### Check Server Health
```bash
curl http://localhost:5000/api/servers/<server_id>/health \
  -H "Authorization: Bearer <token>"
```

## RAG System

### Add Document
```bash
curl -X POST http://localhost:5000/api/rag/documents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Document Title",
    "content": "Full document content...",
    "source": "website.com",
    "metadata": {"type": "guide"}
  }'
```

### Search Documents
```bash
curl -X POST http://localhost:5000/api/rag/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"query": "search term", "limit": 5}'
```

### List Documents
```bash
curl http://localhost:5000/api/rag/documents?limit=10&offset=0 \
  -H "Authorization: Bearer <token>"
```

## WebSocket Connection

Connect to real-time updates:

```javascript
const token = 'your_jwt_token';
const ws = new WebSocket(`ws://localhost:5000/api/ws?token=${token}`);

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Server update:', message);
};

// Subscribe to updates
ws.send(JSON.stringify({ subscribe: 'agent_status' }));
```

## Testing Checklist

- [ ] User registration works
- [ ] User login returns valid token
- [ ] Token refresh works
- [ ] Chat completions basic request works
- [ ] Chat completions streaming works
- [ ] Multi-turn conversations work
- [ ] Agents CRUD operations work
- [ ] Providers CRUD operations work
- [ ] Model syncing works
- [ ] RAG document storage works
- [ ] RAG search works
- [ ] WebSocket connection establishes
- [ ] Real-time updates received
- [ ] Role-based access control enforced
- [ ] Rate limiting activated
