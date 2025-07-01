import { useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";

interface ChatMessagesProps {
  messages: Message[];
  selectedModel: string;
  isLoading: boolean;
}

export default function ChatMessages({ messages, selectedModel, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "已複製到剪貼板",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "複製失敗",
        variant: "destructive",
      });
    }
  };

  const formatResponseTime = (ms: number | null) => {
    if (!ms) return "";
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">歡迎使用AI助手</h3>
          <p className="text-text-secondary">選擇一個AI模型並開始對話</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const timeAgo = formatDistanceToNow(new Date(message.timestamp), {
          addSuffix: true,
          locale: zhCN,
        });

        if (message.role === "user") {
          return (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-3xl bg-primary text-white rounded-2xl rounded-br-md px-4 py-3">
                <div className="font-medium">{message.content}</div>
                <div className="text-xs opacity-75 mt-1">{timeAgo}</div>
              </div>
            </div>
          );
        }

        return (
          <div key={message.id} className="flex justify-start">
            <div className="max-w-3xl bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {selectedModel === "deepseek-v3" ? "DeepSeek-V3" : 
                   selectedModel === "llama-3-70b" ? "Llama-3 70B" :
                   selectedModel === "mixtral-8x7b" ? "Mixtral 8x7B" :
                   selectedModel === "gpt-4o" ? "GPT-4o" :
                   selectedModel}
                </span>
                {message.responseTime && (
                  <span className="text-xs text-text-secondary ml-2">
                    響應時間: {formatResponseTime(message.responseTime)}
                  </span>
                )}
              </div>
              <div className="text-text-primary leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
              <div className="text-xs text-text-secondary mt-2 flex items-center justify-between">
                <span>{timeAgo}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(message.content)}
                    title="複製"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    title="點讚"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    title="點踩"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-3xl bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-3">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                <Bot className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm font-medium text-text-primary">
                {selectedModel === "deepseek-v3" ? "DeepSeek-V3" : 
                 selectedModel === "llama-3-70b" ? "Llama-3 70B" :
                 selectedModel === "mixtral-8x7b" ? "Mixtral 8x7B" :
                 selectedModel === "gpt-4o" ? "GPT-4o" :
                 selectedModel}
              </span>
              <span className="text-xs text-text-secondary ml-2">正在思考...</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:0.2s]"></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
