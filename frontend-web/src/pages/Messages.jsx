import { useState } from "react";
import { cn } from "@/lib/utils";
import ChatPanel from "@/components/messages/ChatPanel";
import ConversationList from "@/components/messages/ConversationList";
import { mockConversations } from "@/data/mockConversations";

function currentTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Messages() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeId, setActiveId] = useState(mockConversations[0].id);
  const [chatOpen, setChatOpen] = useState(false);

  const active = conversations.find((item) => item.id === activeId);

  function updateActive(id, change) {
    setConversations((current) =>
      current.map((item) => (item.id === id ? { ...item, ...change(item) } : item)),
    );
  }

  function handleSelect(id) {
    setActiveId(id);
    setChatOpen(true);
    updateActive(id, () => ({ unread: 0 }));
  }

  function handleSend(text) {
    const time = currentTime();
    updateActive(activeId, (item) => ({
      time,
      messages: [
        ...item.messages,
        { id: item.messages.length + 1, from: "me", day: "Hoje", time, text },
      ],
    }));
  }

  return (
    <div className="flex h-[calc(100svh-9.5rem)] min-h-112 w-full overflow-hidden rounded-2xl bg-card shadow-xs">
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        className={cn(
          "w-full md:flex md:w-80 md:shrink-0 md:border-r md:border-border/60 lg:w-96",
          chatOpen ? "hidden" : "flex",
        )}
      />
      <ChatPanel
        key={active.id}
        conversation={active}
        onBack={() => setChatOpen(false)}
        onSend={handleSend}
        className={cn("flex-1 md:flex", chatOpen ? "flex" : "hidden")}
      />
    </div>
  );
}
