import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Ejemplo 1: Agente con OpenAI
export const openaiAgent = new Agent({
  name: "OpenAI Agent",
  instructions: "Eres un asistente útil que responde preguntas.",
  model: openai("gpt-4o"), // o "gpt-4o-mini" para ahorrar costos
  tools: {},
});

// Ejemplo 2: Agente con Google Gemini
export const geminiAgent = new Agent({
  name: "Gemini Agent",
  instructions: "Eres un asistente útil que responde preguntas.",
  model: google("gemini-2.0-flash-exp"), // o "gemini-1.5-pro" para más capacidad
  tools: {},
});

// Ejemplo 3: Agente con Ollama (local)
// Nota: Ollama debe estar corriendo en http://localhost:11434
const ollamaProvider = createOpenAICompatible({
  baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  apiKey: "ollama", // Ollama no requiere API key real, pero el SDK lo necesita
});

export const ollamaAgent = new Agent({
  name: "Ollama Agent",
  instructions: "Eres un asistente útil que responde preguntas.",
  model: ollamaProvider("llama3.2"), // Cambia por el modelo que tengas instalado
  tools: {},
});

// Ejemplo 4: Agente con DeepSeek
const deepseekProvider = createOpenAICompatible({
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY!,
});

export const deepseekAgent = new Agent({
  name: "DeepSeek Agent",
  instructions: "Eres un asistente útil que responde preguntas.",
  model: deepseekProvider("deepseek-chat"), // o "deepseek-coder" para código
  tools: {},
});

// Ejemplo 5: Agente con modelo dinámico (puede cambiar según contexto)
export const flexibleAgent = new Agent({
  name: "Flexible Agent",
  instructions: "Eres un asistente útil que responde preguntas.",
  // El modelo se resuelve dinámicamente basado en el contexto
  model: ({ runtimeContext }) => {
    const preferredModel = runtimeContext?.get("preferredModel") || "openai";
    
    switch (preferredModel) {
      case "gemini":
        return google("gemini-2.0-flash-exp");
      case "ollama":
        return ollamaProvider("llama3.2");
      case "deepseek":
        return deepseekProvider("deepseek-chat");
      default:
        return openai("gpt-4o");
    }
  },
  tools: {},
});

