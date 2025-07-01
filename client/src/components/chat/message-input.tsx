import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  selectedModel: string;
  disabled?: boolean;
}

const quickTemplates = [
  { key: "explain", label: "解釋概念", template: "請解釋以下概念：" },
  { key: "code", label: "編寫代碼", template: "請編寫代碼來實現：" },
  { key: "translate", label: "翻譯文本", template: "請將以下文本翻譯成中文：" },
];

export default function MessageInput({ onSendMessage, selectedModel, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const maxChars = 4000;
  const charCount = message.length;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [message]);

  const handleSend = async () => {
    if (!message.trim() || isLoading || disabled) return;

    setIsLoading(true);
    try {
      await onSendMessage(message.trim());
      setMessage("");
    } catch (error) {
      toast({
        title: "發送失敗",
        description: error instanceof Error ? error.message : "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertTemplate = (template: string) => {
    setMessage(template);
    textareaRef.current?.focus();
  };

  const getCharCountColor = () => {
    if (charCount > maxChars) return "text-error";
    if (charCount > maxChars * 0.9) return "text-warning";
    return "text-text-secondary";
  };

  return (
    <div className="bg-surface border-t border-border p-4">
      <div className="max-w-4xl mx-auto">
        {/* Character Counter and Status */}
        <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
          <div className="flex items-center space-x-4">
            <span className={getCharCountColor()}>
              字符數: {charCount}/{maxChars}
            </span>
            <span>
              模型: <span className="font-medium">
                {selectedModel === "deepseek-v3" ? "DeepSeek-V3" : 
                 selectedModel === "llama-3-70b" ? "Llama-3 70B" :
                 selectedModel === "mixtral-8x7b" ? "Mixtral 8x7B" :
                 selectedModel === "gpt-4o" ? "GPT-4o" :
                 selectedModel}
              </span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span>狀態: </span>
            <span className="text-success font-medium">已就緒</span>
          </div>
        </div>

        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="輸入您的問題，按Enter發送..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            className="min-h-[80px] max-h-[200px] pr-20 resize-none"
            style={{ height: "auto" }}
          />
          
          {/* Send Button */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="附加文件"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!message.trim() || isLoading || disabled || charCount > maxChars}
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? "發送中..." : "發送"}
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 mt-3">
          <span className="text-xs text-text-secondary">快速操作:</span>
          {quickTemplates.map((template) => (
            <Button
              key={template.key}
              variant="secondary"
              size="sm"
              className="text-xs"
              onClick={() => insertTemplate(template.template)}
              disabled={disabled}
            >
              {template.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
