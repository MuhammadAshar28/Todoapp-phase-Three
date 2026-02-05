import React, { useState, useRef, useEffect } from 'react';
import { JWTHandler } from '../auth/JWTHandler';
import { sendMessage } from '../../src/services/chatService';
import { addMessageToConversation } from '../utils/apiClient';
import { ChatMessage } from '../../src/types/chatTypes';

interface CustomChatProps {
  userId: string;
}

const CustomChat: React.FC<CustomChatProps> = ({ userId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        content: inputValue,
        role: 'user',
        timestamp: new Date(),
        status: 'sending',
      };

      setMessages(prev => [...prev, userMessage]);
      const currentInput = inputValue;
      setInputValue('');

      // Send message to backend
      const token = JWTHandler.getToken();
      if (!token) {
        console.error('No JWT token found in localStorage');
        throw new Error('No JWT token available. Please sign in again.');
      }

      if (!JWTHandler.isValidToken()) {
        console.error('JWT token is invalid or expired');
        throw new Error('Invalid or expired JWT token. Please sign in again.');
      }

      const userIdFromToken = JWTHandler.getUserIdFromToken(token);
      if (!userIdFromToken) {
        console.error('No user ID found in JWT token');
        throw new Error('No user ID found in token. Please sign in again.');
      }

      if (userIdFromToken !== userId) {
        console.error(`User ID mismatch: token=${userIdFromToken}, prop=${userId}`);
        throw new Error('User ID mismatch between token and request');
      }

      const response = await sendMessage(userId, { message: currentInput });

      if (response.success) {
        // Add assistant response to messages
        const assistantMessageContent = response.assistantMessage || 'No response from assistant.';

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
          content: assistantMessageContent,
          role: 'assistant',
          timestamp: new Date(),
          status: 'confirmed',
        };

        setMessages(prev => {
          // Update the user message status to confirmed and add assistant response
          const updatedPrev = prev.map(msg =>
            msg.id === userMessage.id ? { ...msg, status: 'confirmed' } : msg
          );
          return [...updatedPrev, assistantMessage];
        });

        // Store both messages in history
        addMessageToConversation(userId, userMessage);
        addMessageToConversation(userId, assistantMessage);
      } else {
        // Update user message status to error
        setMessages(prev =>
          prev.map(msg =>
            msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
          )
        );

        throw new Error(response.error?.message || 'Failed to get response from backend');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error sending message:', err);

      // If there's an error, update the last message to show error status
      setMessages(prev => {
        if (prev.length > 0) {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === 'user' && lastMessage.status === 'sending') {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, status: 'error' }
            ];
          }
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
      {/* Messages container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-900">
        {messages.length === 0 ? (
          <div className="text-center text-zinc-500 dark:text-zinc-400 py-8">
            Start a conversation to manage your tasks with AI...
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
                } ${
                  message.status === 'error' ? 'bg-red-500' : ''
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.role === 'user'
                    ? 'text-blue-100'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {message.status === 'sending' && ' • Sending...'}
                  {message.status === 'error' && ' • Error'}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-800">
        {error && (
          <div className="text-red-500 text-sm mb-2">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your task or question here..."
            className="flex-grow px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomChat;