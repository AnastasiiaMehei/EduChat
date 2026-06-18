'use client';

import { useState } from 'react';
import ChatWindow from '../../components/ChatWindow';
import Navbar from '../../components/Navbar';

interface ChatMessage {
  text: string;
  sender: 'user' | 'assistant';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: 'Hi! I am your AI assistant. How can I help you today?',
      sender: 'assistant',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    const trimmed = draft.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      text: trimmed,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        text: data.reply?.text || 'No response received.',
        sender: 'assistant',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry, something went wrong while contacting the server.',
          sender: 'assistant',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <ChatWindow
          messages={messages}
          draft={draft}
          onDraftChange={setDraft}
          onSend={sendMessage}
        />
        {isLoading && (
          <p className="mt-3 text-sm text-slate-300">Thinking...</p>
        )}
      </main>
    </div>
  );
}
