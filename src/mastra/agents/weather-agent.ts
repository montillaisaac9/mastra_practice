import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { weatherTool } from '../tools/weather-tool';
import { scorers } from '../scorers/weather-scorer';
import { getDynamicModel } from '../config/model-providers';

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information and can help planning activities based on the weather.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn't in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative
      - If the user asks for activities and provides the weather forecast, suggest activities based on the weather forecast.
      - If the user asks for activities, respond in the format they request.

      Use the weatherTool to fetch current weather data.
`,
  // Modelo dinámico: puede cambiar según el contexto o preferencias
  // Por defecto usa OpenAI GPT-4o-mini, pero puede usar Gemini, DeepSeek, etc.
  model: ({ runtimeContext }) => {
    const preferredModel = runtimeContext?.get("preferredModel") as string | undefined;
    const modelProvider = runtimeContext?.get("modelProvider") as string | undefined;
    
    // Si se especifica un modelo completo (provider/model)
    if (preferredModel) {
      return getDynamicModel(preferredModel, "openai", "gpt-4o-mini");
    }
    
    // Si solo se especifica el proveedor, usar el modelo por defecto
    if (modelProvider) {
      return getDynamicModel(undefined, modelProvider as any, "gpt-4o-mini");
    }
    
    // Por defecto: usar OpenAI GPT-4o-mini
    // Puedes cambiar el modelo por defecto aquí o usar variables de entorno
    const defaultModel = process.env.WEATHER_AGENT_MODEL || "openai/gpt-4o-mini";
    return getDynamicModel(defaultModel, "openai", "gpt-4o-mini");
  },
  tools: { weatherTool },
  scorers: {
    toolCallAppropriateness: {
      scorer: scorers.toolCallAppropriatenessScorer,
      sampling: {
        type: 'ratio',
        rate: 1,
      },
    },
    completeness: {
      scorer: scorers.completenessScorer,
      sampling: {
        type: 'ratio',
        rate: 1,
      },
    },
    translation: {
      scorer: scorers.translationScorer,
      sampling: {
        type: 'ratio',
        rate: 1,
      },
    },
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
  }),
});
