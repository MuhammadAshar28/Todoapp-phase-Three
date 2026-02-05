'use client';

import { useState, useEffect } from 'react';
import ChatKitWrapper from '@/components/ChatInterface/ChatKitWrapper';
import { useAuth } from '@/hooks/useAuth';

export default function ChatPage() {
  const { user } = useAuth();

  // No need to check authentication here since AuthGuard will handle it
  // The page will only render if user is authenticated

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-4">
      <header className="chat-header max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 text-center">
          Todo Management Chat
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-center">
          Manage your tasks through natural language
        </p>
      </header>

      <main className="chat-main max-w-4xl mx-auto bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-4">
        <ChatKitWrapper userId={user!.userId} />
      </main>

      <footer className="chat-footer max-w-4xl mx-auto mt-6 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Your conversations are securely processed through our backend.
        </p>
      </footer>
    </div>
  );
}