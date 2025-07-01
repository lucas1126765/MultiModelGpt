import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./services/ai";
import { insertConversationSchema, insertMessageSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: "用戶名已存在" });
      }
      
      const user = await storage.createUser(validatedData);
      res.status(201).json({
        user: { id: user.id, username: user.username },
        message: "註冊成功"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "數據驗證失敗", details: error.errors });
      }
      res.status(500).json({ error: "註冊失敗" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "用戶名和密碼為必填項" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "用戶名或密碼錯誤" });
      }
      
      res.json({
        user: { id: user.id, username: user.username },
        message: "登入成功"
      });
    } catch (error) {
      res.status(500).json({ error: "登入失敗" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    res.json({ message: "登出成功" });
  });

  // Get all conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get specific conversation
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid conversation ID" });
      }
      
      const conversation = await storage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(validatedData);
      res.status(201).json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // Update conversation
  app.patch("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid conversation ID" });
      }
      
      const conversation = await storage.updateConversation(id, req.body);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to update conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid conversation ID" });
      }
      
      const deleted = await storage.deleteConversation(id);
      if (!deleted) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Get messages for a conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid conversation ID" });
      }
      
      const messages = await storage.getMessages(id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Send message and get AI response
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      if (isNaN(conversationId)) {
        return res.status(400).json({ error: "Invalid conversation ID" });
      }

      const { content, model, apiKey } = req.body;
      
      if (!content || !model) {
        return res.status(400).json({ error: "Content and model are required" });
      }

      // Get conversation to check if it exists
      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Create user message
      const userMessage = await storage.createMessage({
        conversationId,
        role: "user",
        content
      });

      // Get conversation history for context
      const messages = await storage.getMessages(conversationId);
      const chatMessages = messages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }));

      // Get AI response
      const aiResponse = await aiService.chat(
        model,
        chatMessages
      );

      // Create AI message
      const aiMessage = await storage.createMessage({
        conversationId,
        role: "assistant",
        content: aiResponse.content,
        responseTime: aiResponse.responseTime
      });

      // Update conversation timestamp
      await storage.updateConversation(conversationId, {
        updatedAt: new Date()
      });

      res.json({
        userMessage,
        aiMessage,
        responseTime: aiResponse.responseTime
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to process message" 
      });
    }
  });

  // Clear conversation messages
  app.delete("/api/conversations/:id/messages", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid conversation ID" });
      }
      
      await storage.deleteMessages(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to clear messages" });
    }
  });

  // Validate API key
  app.post("/api/validate-key", async (req, res) => {
    try {
      const { model, apiKey } = req.body;
      
      if (!model || !apiKey) {
        return res.status(400).json({ error: "Model and API key are required" });
      }

      const isValid = aiService.validateApiKey(model, apiKey);
      res.json({ valid: isValid });
    } catch (error) {
      res.status(500).json({ error: "Failed to validate API key" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
