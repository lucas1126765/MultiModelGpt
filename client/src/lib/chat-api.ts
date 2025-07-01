import { apiRequest } from "./queryClient";
import type { Conversation, Message, InsertConversation } from "@shared/schema";

export interface ChatResponse {
  userMessage: Message;
  aiMessage: Message;
  responseTime: number;
}

export const chatApi = {
  // Conversations
  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiRequest("GET", "/api/conversations");
    return response.json();
  },

  getConversation: async (id: number): Promise<Conversation> => {
    const response = await apiRequest("GET", `/api/conversations/${id}`);
    return response.json();
  },

  createConversation: async (data: InsertConversation): Promise<Conversation> => {
    const response = await apiRequest("POST", "/api/conversations", data);
    return response.json();
  },

  updateConversation: async (id: number, data: Partial<Conversation>): Promise<Conversation> => {
    const response = await apiRequest("PATCH", `/api/conversations/${id}`, data);
    return response.json();
  },

  deleteConversation: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/conversations/${id}`);
  },

  // Messages
  getMessages: async (conversationId: number): Promise<Message[]> => {
    const response = await apiRequest("GET", `/api/conversations/${conversationId}/messages`);
    return response.json();
  },

  sendMessage: async (
    conversationId: number,
    content: string,
    model: string
  ): Promise<ChatResponse> => {
    const response = await apiRequest("POST", `/api/conversations/${conversationId}/messages`, {
      content,
      model
    });
    return response.json();
  },

  clearMessages: async (conversationId: number): Promise<void> => {
    await apiRequest("DELETE", `/api/conversations/${conversationId}/messages`);
  },

  // Utility
  validateApiKey: async (model: string, apiKey: string): Promise<{ valid: boolean }> => {
    const response = await apiRequest("POST", "/api/validate-key", { model, apiKey });
    return response.json();
  }
};
