import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Conversation } from "@shared/schema";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  const timeAgo = formatDistanceToNow(new Date(conversation.updatedAt), {
    addSuffix: true,
    locale: zhCN,
  });

  return (
    <div
      className={`p-3 mb-2 rounded-lg cursor-pointer border-l-2 transition-all ${
        isActive
          ? "border-primary bg-blue-50 dark:bg-blue-950"
          : "border-transparent hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
      onClick={onClick}
    >
      <div className="text-sm font-medium text-text-primary mb-1 truncate">
        {conversation.title}
      </div>
      <div className="text-xs text-text-secondary truncate">
        {conversation.model} • {timeAgo}
      </div>
    </div>
  );
}
