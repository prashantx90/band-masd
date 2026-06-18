import { useState, useEffect, useCallback } from 'react';
import { getMessages, createMessage } from '../services/message.service';
import { Message } from '../types';

export function useMessages(workflowId?: string, pollInterval = 2000) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await getMessages(workflowId);
      setMessages(data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  useEffect(() => {
    fetchMessages();
    const timer = setInterval(fetchMessages, pollInterval);
    return () => clearInterval(timer);
  }, [fetchMessages, pollInterval]);

  const sendMessage = async (data: Partial<Message>) => {
    const newMsg = await createMessage({
      ...data,
      workflow_id: workflowId,
    });
    await fetchMessages();
    return newMsg;
  };

  return { messages, loading, error, refresh: fetchMessages, sendMessage };
}
