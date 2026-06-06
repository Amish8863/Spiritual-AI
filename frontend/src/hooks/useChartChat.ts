import { useState, useCallback } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseChartChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

export function useChartChat() {
  const [state, setState] = useState<UseChartChatState>({
    messages: [],
    loading: false,
    error: null,
  });

  const sendMessage = useCallback(async (userMessage: string, birthData: any) => {
    if (!userMessage.trim()) return;

    // Add user message to chat
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      loading: true,
      error: null,
    }));

    try {
      const response = await fetch('http://localhost:5000/api/interpretation/chart-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage,
          birthData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const result = await response.json();
      
      // Add assistant message to chat
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.data.response,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMsg],
        loading: false,
        error: null,
      }));

      return result.data.response;
    } catch (err: any) {
      const error = err.message || 'Failed to get response';
      setState(prev => ({
        ...prev,
        loading: false,
        error,
      }));
      throw err;
    }
  }, []);

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      loading: false,
      error: null,
    });
  }, []);

  return { ...state, sendMessage, clearChat };
}
