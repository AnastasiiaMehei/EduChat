import MessageBubble from './MessageBubble';
import InputBox from './InputBox';

interface ChatMessage {
  text: string;
  sender: 'user' | 'assistant';
}

interface ChatWindowProps {
  messages: ChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatWindow({
  messages,
  draft,
  onDraftChange,
  onSend,
}: ChatWindowProps) {
  return (
    <section className="flex h-[70vh] flex-col rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl">
      <div className="flex-1 space-y-3 overflow-y-auto p-6">
        {messages.map((message, index) => (
          <MessageBubble
            key={`${message.sender}-${index}`}
            text={message.text}
            sender={message.sender}
          />
        ))}
      </div>
      <div className="border-t border-slate-800 p-4">
        <InputBox value={draft} onChange={onDraftChange} onSend={onSend} />
      </div>
    </section>
  );
}
