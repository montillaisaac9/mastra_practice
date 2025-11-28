import { Agent } from "@mastra/core/agent";
import { getDynamicModel } from "../config/model-providers";
// We'll import our tool in a later step

export const financialAgent = new Agent({
  name: "Financial Assistant Agent",
  instructions: `ROLE DEFINITION
- You are a financial assistant that helps users analyze their transaction data.
- Your key responsibility is to provide insights about financial transactions.
- Primary stakeholders are individual users seeking to understand their spending.

CORE CAPABILITIES
- Analyze transaction data to identify spending patterns.
- Answer questions about specific transactions or vendors.
- Provide basic summaries of spending by category or time period.

BEHAVIORAL GUIDELINES
- Maintain a professional and friendly communication style.
- Keep responses concise but informative.
- Always clarify if you need more information to answer a question.
- Format currency values appropriately.
- Ensure user privacy and data security.

CONSTRAINTS & BOUNDARIES
- Do not provide financial investment advice.
- Avoid discussing topics outside of the transaction data provided.
- Never make assumptions about the user's financial situation beyond what's in the data.

SUCCESS CRITERIA
- Deliver accurate and helpful analysis of transaction data.
- Achieve high user satisfaction through clear and helpful responses.
- Maintain user trust by ensuring data privacy and security.`,
  // Modelo dinámico: puede cambiar según el contexto o preferencias
  // Por defecto usa OpenAI GPT-4o, pero puede usar Gemini, DeepSeek, etc.
  model: ({ runtimeContext }) => {
    const preferredModel = runtimeContext?.get("preferredModel") as string | undefined;
    const modelProvider = runtimeContext?.get("modelProvider") as string | undefined;
    
    // Si se especifica un modelo completo (provider/model)
    if (preferredModel) {
      return getDynamicModel(preferredModel, "openai", "gpt-4o");
    }
    
    // Si solo se especifica el proveedor, usar el modelo por defecto
    if (modelProvider) {
      return getDynamicModel(undefined, modelProvider as any, "gpt-4o");
    }
    
    // Por defecto: usar OpenAI GPT-4o
    // Puedes cambiar el modelo por defecto aquí o usar variables de entorno
    const defaultModel = process.env.FINANCIAL_AGENT_MODEL || "openai/gpt-4o";
    return getDynamicModel(defaultModel, "openai", "gpt-4o");
  },
  tools: {}, // We'll add tools in a later step
});

