interface MessageBubbleProps {
  text: string;
  sender: 'user' | 'assistant';
}

export default function MessageBubble({ text, sender }: MessageBubbleProps) {
  const isUser = sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 text-slate-100'
        }`}
      >
        {text}
      </div>
    </div>
  );
}
