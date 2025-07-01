import OpenAI from "openai";
import Together from "together-ai";

const MODEL_CONFIGS = {
  "deepseek-v3": { provider: "together", model: "deepseek-ai/DeepSeek-V3" },
  "llama-3-70b": { provider: "together", model: "meta-llama/Llama-3-70b-chat-hf" },
  "mixtral-8x7b": { provider: "together", model: "mistralai/Mixtral-8x7B-Instruct-v0.1" },
  "gpt-4o": { provider: "openai", model: "gpt-4o" },
  "gpt-3.5-turbo": { provider: "openai", model: "gpt-3.5-turbo" }
};

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  content: string;
  responseTime: number;
}

export class AIService {
  private openai: OpenAI | null = null;
  private together: Together | null = null;

  constructor() {
    // Initialize OpenAI client if API key is available
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
    }
    
    // Initialize Together client if API key is available
    const togetherKey = process.env.TOGETHER_API_KEY;
    if (togetherKey) {
      this.together = new Together({ apiKey: togetherKey });
    }
  }

  async chat(
    model: string,
    messages: ChatMessage[]
  ): Promise<ChatResponse> {
    const startTime = Date.now();
    
    const config = MODEL_CONFIGS[model as keyof typeof MODEL_CONFIGS];
    if (!config) {
      throw new Error(`Unsupported model: ${model}`);
    }

    try {
      let content: string;

      switch (config.provider) {
        case "together":
          content = await this.chatWithTogether(config.model, messages);
          break;
        case "openai":
          content = await this.chatWithOpenAI(config.model, messages);
          break;
        default:
          throw new Error(`Unsupported provider: ${config.provider}`);
      }

      const responseTime = Date.now() - startTime;
      return { content, responseTime };
    } catch (error) {
      throw new Error(`AI service error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async chatWithOpenAI(
    model: string,
    messages: ChatMessage[]
  ): Promise<string> {
    const client = this.openai;
    
    if (!client) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await client.chat.completions.create({
      model,
      messages,
      max_tokens: 2000,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "No response generated";
  }

  private async chatWithTogether(
    model: string,
    messages: ChatMessage[]
  ): Promise<string> {
    const client = this.together;
    
    if (!client) {
      throw new Error("Together API key not configured");
    }

    const response = await client.chat.completions.create({
      model,
      messages,
      max_tokens: 2000,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "No response generated";
  }

  validateApiKey(model: string, apiKey: string): boolean {
    if (!apiKey || apiKey.length < 10) return false;
    
    const config = MODEL_CONFIGS[model as keyof typeof MODEL_CONFIGS];
    if (!config) return false;
    
    // Basic format validation based on provider
    switch (config.provider) {
      case "together":
        return typeof apiKey === "string" && apiKey.length > 20;
      case "openai":
        return typeof apiKey === "string" && apiKey.startsWith("sk-");
      default:
        return false;
    }
  }
}

export const aiService = new AIService();
