import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { chatApi } from "@/lib/chat-api";
import Sidebar from "@/components/chat/sidebar";
import ChatMessages from "@/components/chat/chat-messages";
import MessageInput from "@/components/chat/message-input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Settings, User, LogOut } from "lucide-react";
import { getModelDisplayName } from "@/lib/model-utils";
import { useToast } from "@/hooks/use-toast";
import type { Conversation, Message } from "@shared/schema";

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState("deepseek-v3");
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const { data: conversations = [], refetch: refetchConversations } = useQuery({
    queryKey: ["/api/conversations"],
    queryFn: () => chatApi.getConversations(),
  });

  const { data: currentConversation } = useQuery({
    queryKey: ["/api/conversations", currentConversationId],
    queryFn: () => currentConversationId ? chatApi.getConversation(currentConversationId) : null,
    enabled: !!currentConversationId,
  });

  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ["/api/conversations", currentConversationId, "messages"],
    queryFn: () => currentConversationId ? chatApi.getMessages(currentConversationId) : [],
    enabled: !!currentConversationId,
  });

  const handleNewConversation = async () => {
    try {
      const newConversation = await chatApi.createConversation({
        title: `新對話 #${conversations.length + 1}`,
        model: selectedModel,
      });
      setCurrentConversationId(newConversation.id);
      refetchConversations();
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversationId(conversation.id);
    setSelectedModel(conversation.model);
    setSidebarOpen(false);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) {
      await handleNewConversation();
      return;
    }

    try {
      await chatApi.sendMessage(currentConversationId, content, selectedModel);
      refetchMessages();
      refetchConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  const handleClearHistory = async () => {
    for (const conversation of conversations) {
      await chatApi.deleteConversation(conversation.id);
    }
    setCurrentConversationId(null);
    refetchConversations();
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    if (currentConversationId) {
      chatApi.updateConversation(currentConversationId, { model });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "登出成功",
      description: "您已成功登出",
    });
    setLocation("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`w-80 bg-surface border-r border-border flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:relative z-30 h-full`}>
        <Sidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          selectedModel={selectedModel}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onModelChange={handleModelChange}
          onClearHistory={handleClearHistory}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-surface border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-3"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold text-text-primary">
                {currentConversation?.title || "當前對話"}
              </h2>
              <div className="text-sm text-text-secondary">
                使用 <span className="font-medium">{getModelDisplayName(selectedModel)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">已連接</span>
            </div>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  登出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Chat Messages */}
        <ChatMessages 
          messages={messages} 
          selectedModel={selectedModel}
          isLoading={false}
        />

        {/* Message Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          selectedModel={selectedModel}
          disabled={false}
        />
      </div>
    </div>
  );
}
