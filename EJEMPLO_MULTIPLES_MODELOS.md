# Configuración de Múltiples Modelos en Mastra

Este documento muestra cómo configurar y usar múltiples modelos de IA (Gemini, Ollama, DeepSeek) con sus respectivas API keys en Mastra.

## 1. Instalar los Paquetes Necesarios

```bash
npm install @ai-sdk/openai @ai-sdk/google @ai-sdk/anthropic
# Para Ollama (si usas OpenAI-compatible)
npm install @ai-sdk/openai-compatible
# Para DeepSeek (también usa OpenAI-compatible)
```

## 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# OpenAI
OPENAI_API_KEY=tu-api-key-de-openai

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=tu-api-key-de-gemini

# Ollama (si está corriendo localmente, no necesita API key)
OLLAMA_BASE_URL=http://localhost:11434

# DeepSeek
DEEPSEEK_API_KEY=tu-api-key-de-deepseek
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

## 3. Crear Agentes con Diferentes Modelos

### Opción A: Usando funciones de proveedores

```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Agente con OpenAI
export const openaiAgent = new Agent({
  name: "OpenAI Agent",
  instructions: "Eres un asistente útil.",
  model: openai("gpt-4o"),
  tools: {},
});

// Agente con Google Gemini
export const geminiAgent = new Agent({
  name: "Gemini Agent",
  instructions: "Eres un asistente útil.",
  model: google("gemini-2.0-flash-exp"),
  tools: {},
});

// Agente con Ollama (local)
const ollamaProvider = createOpenAICompatible({
  baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  apiKey: "ollama", // Ollama no requiere API key real
});

export const ollamaAgent = new Agent({
  name: "Ollama Agent",
  instructions: "Eres un asistente útil.",
  model: ollamaProvider("llama3.2"),
  tools: {},
});

// Agente con DeepSeek
const deepseekProvider = createOpenAICompatible({
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY!,
});

export const deepseekAgent = new Agent({
  name: "DeepSeek Agent",
  instructions: "Eres un asistente útil.",
  model: deepseekProvider("deepseek-chat"),
  tools: {},
});
```

### Opción B: Usando strings (más simple)

```typescript
import { Agent } from "@mastra/core/agent";

// Agente con OpenAI
export const openaiAgent = new Agent({
  name: "OpenAI Agent",
  instructions: "Eres un asistente útil.",
  model: "openai/gpt-4o",
  tools: {},
});

// Agente con Google Gemini
export const geminiAgent = new Agent({
  name: "Gemini Agent",
  instructions: "Eres un asistente útil.",
  model: "google/gemini-2.0-flash-exp",
  tools: {},
});
```

## 4. Registrar los Agentes en Mastra

```typescript
// src/mastra/index.ts
import { Mastra } from "@mastra/core/mastra";
import { openaiAgent } from "./agents/openai-agent";
import { geminiAgent } from "./agents/gemini-agent";
import { ollamaAgent } from "./agents/ollama-agent";
import { deepseekAgent } from "./agents/deepseek-agent";

export const mastra = new Mastra({
  agents: {
    openaiAgent,
    geminiAgent,
    ollamaAgent,
    deepseekAgent,
  },
});
```

## 5. Usar Modelos Dinámicamente

También puedes cambiar el modelo dinámicamente en tiempo de ejecución:

```typescript
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";

export const flexibleAgent = new Agent({
  name: "Flexible Agent",
  instructions: "Eres un asistente útil.",
  // El modelo puede ser una función que se resuelve dinámicamente
  model: ({ runtimeContext }) => {
    const preferredModel = runtimeContext?.get("preferredModel") || "openai";
    
    if (preferredModel === "gemini") {
      return google("gemini-2.0-flash-exp");
    }
    return openai("gpt-4o");
  },
  tools: {},
});
```

## Notas Importantes

1. **API Keys**: Asegúrate de tener las API keys correctas en tu archivo `.env`
2. **Ollama**: Si usas Ollama localmente, asegúrate de que el servidor esté corriendo
3. **DeepSeek**: Verifica la URL base correcta en la documentación de DeepSeek
4. **Modelos Disponibles**: Consulta la documentación de cada proveedor para ver los modelos disponibles

## Modelos Soportados

- **OpenAI**: gpt-4o, gpt-4o-mini, gpt-4-turbo, etc.
- **Google Gemini**: gemini-2.0-flash-exp, gemini-1.5-pro, gemini-1.5-flash, etc.
- **Ollama**: Cualquier modelo instalado localmente (llama3.2, mistral, etc.)
- **DeepSeek**: deepseek-chat, deepseek-coder, etc.

