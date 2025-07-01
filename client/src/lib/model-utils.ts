export const MODEL_DISPLAY_NAMES = {
  "deepseek-v3": "DeepSeek-V3",
  "llama-3-70b": "Llama-3 70B", 
  "mixtral-8x7b": "Mixtral 8x7B",
  "gpt-4o": "GPT-4o",
  "gpt-3.5-turbo": "GPT-3.5 Turbo"
} as const;

export function getModelDisplayName(model: string): string {
  return MODEL_DISPLAY_NAMES[model as keyof typeof MODEL_DISPLAY_NAMES] || model;
}

export const MODELS = [
  { value: "deepseek-v3", label: "DeepSeek-V3", provider: "Together AI" },
  { value: "llama-3-70b", label: "Llama-3 70B", provider: "Together AI" },
  { value: "mixtral-8x7b", label: "Mixtral 8x7B", provider: "Together AI" },
  { value: "gpt-4o", label: "GPT-4o", provider: "OpenAI" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", provider: "OpenAI" },
] as const;