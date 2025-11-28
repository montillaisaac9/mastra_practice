# Configuración de Múltiples Modelos

Los agentes (`financialAgent` y `weatherAgent`) ahora soportan múltiples modelos de IA y pueden cambiar dinámicamente entre ellos.

## Modelos Disponibles

### OpenAI
- `openai/gpt-4o` - Modelo más potente
- `openai/gpt-4o-mini` - Versión más económica
- `openai/gpt-4-turbo` - Versión turbo

### Google Gemini
- `google/gemini-2.0-flash-exp` - Modelo experimental rápido
- `google/gemini-1.5-pro` - Modelo más potente
- `google/gemini-1.5-flash` - Versión rápida

### DeepSeek
- `deepseek/deepseek-chat` - Modelo de chat general
- `deepseek/deepseek-coder` - Optimizado para código

## Configuración de Variables de Entorno

Agrega estas variables a tu archivo `.env`:

```env
# OpenAI (requerido si usas OpenAI)
OPENAI_API_KEY=tu-api-key-de-openai

# Google Gemini (requerido si usas Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=tu-api-key-de-gemini

# DeepSeek (requerido si usas DeepSeek)
DEEPSEEK_API_KEY=tu-api-key-de-deepseek
DEEPSEEK_BASE_URL=https://api.deepseek.com

# Modelos por defecto para cada agente (opcional)
FINANCIAL_AGENT_MODEL=openai/gpt-4o
WEATHER_AGENT_MODEL=openai/gpt-4o-mini
```

## Uso

### 1. Usar el modelo por defecto

Los agentes usan sus modelos por defecto automáticamente:

```typescript
// financialAgent usa openai/gpt-4o por defecto
// weatherAgent usa openai/gpt-4o-mini por defecto
```

### 2. Cambiar modelo mediante Runtime Context

Puedes cambiar el modelo dinámicamente usando el Runtime Context:

```typescript
import { RuntimeContext } from "@mastra/core/runtime-context";

const context = new RuntimeContext();
context.set("preferredModel", "google/gemini-2.0-flash-exp");

const result = await financialAgent.generate("Analiza mis transacciones", {
  runtimeContext: context,
});
```

### 3. Cambiar modelo mediante variable de entorno

Puedes establecer el modelo por defecto para cada agente en el archivo `.env`:

```env
FINANCIAL_AGENT_MODEL=google/gemini-1.5-pro
WEATHER_AGENT_MODEL=deepseek/deepseek-chat
```

### 4. Usar directamente en el código

También puedes modificar el agente para usar un modelo específico:

```typescript
import { getModel } from "../config/model-providers";

// Usar Gemini directamente
model: getModel("google", "gemini-2.0-flash-exp")

// O usar DeepSeek
model: getModel("deepseek", "deepseek-chat")
```

## Ejemplos

### Ejemplo 1: Usar Gemini para análisis financiero

```typescript
import { RuntimeContext } from "@mastra/core/runtime-context";

const context = new RuntimeContext();
context.set("preferredModel", "google/gemini-1.5-pro");

const analysis = await financialAgent.generate(
  "¿Cuáles son mis gastos más altos este mes?",
  { runtimeContext: context }
);
```

### Ejemplo 2: Usar DeepSeek para el agente del clima

```typescript
import { RuntimeContext } from "@mastra/core/runtime-context";

const context = new RuntimeContext();
context.set("preferredModel", "deepseek/deepseek-chat");

const weather = await weatherAgent.generate(
  "¿Qué tiempo hace en Madrid?",
  { runtimeContext: context }
);
```

## Agregar Nuevos Modelos

Para agregar nuevos modelos, edita `src/mastra/config/model-providers.ts`:

```typescript
export const modelProviders = {
  // ... modelos existentes ...
  
  // Nuevo proveedor
  nuevoProveedor: {
    "modelo-1": () => {
      const provider = createOpenAICompatible({
        name: "nuevo-proveedor",
        baseURL: process.env.NUEVO_PROVEEDOR_URL,
        apiKey: process.env.NUEVO_PROVEEDOR_API_KEY!,
      });
      return provider("modelo-1");
    },
  },
};
```

