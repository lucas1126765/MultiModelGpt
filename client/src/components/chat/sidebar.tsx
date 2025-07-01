import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConversationItem from "./conversation-item";
import { X, Plus, Eye, EyeOff } from "lucide-react";
import { MODELS } from "@/lib/model-utils";
import type { Conversation } from "@shared/schema";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: number | null;
  selectedModel: string;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  onModelChange: (model: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export default function Sidebar({
  conversations,
  currentConversationId,
  selectedModel,
  onSelectConversation,
  onNewConversation,
  onModelChange,
  onClearHistory,
  onClose,
}: SidebarProps) {

  const selectedModelLabel = MODELS.find(m => m.value === selectedModel)?.label || selectedModel;

  return (
    <>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-text-primary">AI助手</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Model Selection */}
      <div className="p-4 border-b border-border">
        <Label className="text-sm font-medium text-text-primary mb-2 block">選擇AI模型</Label>
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                <div className="flex flex-col">
                  <span>{model.label}</span>
                  <span className="text-xs text-muted-foreground">{model.provider}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-2 text-xs text-text-secondary">
          {selectedModelLabel} • <span className="text-success">在線</span>
        </div>
      </div>

      {/* API Status */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-text-primary">API狀態</Label>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-success font-medium">已連接</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-text-secondary">
          AI模型已配置完成，可直接使用
        </div>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-text-primary">對話記錄</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-text-secondary hover:text-error"
              onClick={onClearHistory}
            >
              清除全部
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-2">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-text-secondary text-sm">
              暫無對話記錄
            </div>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === currentConversationId}
                onClick={() => onSelectConversation(conversation)}
              />
            ))
          )}
        </ScrollArea>
      </div>

      {/* New Conversation Button */}
      <div className="p-4 border-t border-border">
        <Button
          className="w-full"
          onClick={onNewConversation}
        >
          <Plus className="h-4 w-4 mr-2" />
          新對話
        </Button>
      </div>
    </>
  );
}
