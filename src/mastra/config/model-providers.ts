import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModelV2 } from "@ai-sdk/provider-v5";

// Configuración de proveedores de modelos
export const modelProviders = {
  // OpenAI
  openai: {
    "gpt-4o": () => openai("gpt-4o"),
    "gpt-4o-mini": () => openai("gpt-4o-mini"),
    "gpt-4-turbo": () => openai("gpt-4-turbo"),
  },
  
  // Google Gemini
  google: {
    "gemini-2.0-flash-exp": () => google("gemini-2.0-flash-exp"),
    "gemini-1.5-pro": () => google("gemini-1.5-pro"),
    "gemini-1.5-flash": () => google("gemini-1.5-flash"),
  },
  
  // DeepSeek
  deepseek: {
    "deepseek-chat": () => {
      const deepseekProvider = createOpenAICompatible({
        name: "deepseek",
        baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
        apiKey: process.env.DEEPSEEK_API_KEY!,
      });
      return deepseekProvider("deepseek-chat");
    },
    "deepseek-coder": () => {
      const deepseekProvider = createOpenAICompatible({
        name: "deepseek",
        baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
        apiKey: process.env.DEEPSEEK_API_KEY!,
      });
      return deepseekProvider("deepseek-coder");
    },
  },
};

// Tipo para los nombres de modelos disponibles
export type ModelProvider = keyof typeof modelProviders;
export type ModelName<T extends ModelProvider> = keyof typeof modelProviders[T];

// Función helper para obtener un modelo
export function getModel(
  provider: ModelProvider,
  modelName: string
): LanguageModelV2 {
  const providerModels = modelProviders[provider];
  if (!providerModels) {
    throw new Error(`Provider ${provider} not found`);
  }
  
  const modelFactory = providerModels[modelName as keyof typeof providerModels];
  if (!modelFactory) {
    throw new Error(`Model ${modelName} not found in provider ${provider}`);
  }
  
  return modelFactory();
}

// Función para verificar si un proveedor tiene API key configurada
function hasApiKey(provider: ModelProvider): boolean {
  switch (provider) {
    case "openai":
      return !!process.env.OPENAI_API_KEY;
    case "google":
      return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    case "deepseek":
      return !!process.env.DEEPSEEK_API_KEY;
    default:
      return false;
  }
}

// Función para obtener modelo dinámicamente basado en preferencias
export function getDynamicModel(
  preferredModel?: string,
  fallbackProvider: ModelProvider = "openai",
  fallbackModel: string = "gpt-4o"
): LanguageModelV2 {
  // Si se especifica un modelo preferido, intentar usarlo
  if (preferredModel) {
    // Formato: "provider/model-name" o solo "model-name"
    if (preferredModel.includes("/")) {
      const [provider, model] = preferredModel.split("/");
      const providerKey = provider as ModelProvider;
      
      // Verificar si el proveedor tiene API key
      if (!hasApiKey(providerKey)) {
        console.warn(
          `API key not configured for provider ${provider}. ` +
          `Set ${provider === "google" ? "GOOGLE_GENERATIVE_AI_API_KEY" : 
              provider === "openai" ? "OPENAI_API_KEY" : 
              "DEEPSEEK_API_KEY"} environment variable. Using fallback.`
        );
      } else {
        try {
          return getModel(providerKey, model);
        } catch (error) {
          console.warn(`Failed to load model ${preferredModel}, using fallback:`, error);
        }
      }
    } else {
      // Buscar en todos los proveedores que tengan API key
      for (const provider of Object.keys(modelProviders) as ModelProvider[]) {
        if (hasApiKey(provider)) {
          try {
            return getModel(provider, preferredModel);
          } catch {
            // Continuar buscando
          }
        }
      }
    }
  }
  
  // Verificar si el fallback tiene API key
  if (!hasApiKey(fallbackProvider)) {
    console.warn(
      `API key not configured for fallback provider ${fallbackProvider}. ` +
      `Trying to find an available provider...`
    );
    
    // Buscar cualquier proveedor disponible
    for (const provider of Object.keys(modelProviders) as ModelProvider[]) {
      if (hasApiKey(provider)) {
        const defaultModel = provider === "openai" ? "gpt-4o" :
                            provider === "google" ? "gemini-2.0-flash-exp" :
                            "deepseek-chat";
        console.warn(`Using ${provider}/${defaultModel} as fallback`);
        return getModel(provider, defaultModel);
      }
    }
    
    throw new Error(
      `No API keys configured. Please set at least one of: ` +
      `OPENAI_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, or DEEPSEEK_API_KEY`
    );
  }
  
  // Usar fallback
  return getModel(fallbackProvider, fallbackModel);
}

