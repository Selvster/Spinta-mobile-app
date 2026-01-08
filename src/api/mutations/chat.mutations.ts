import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  SendMessageRequest,
  SendMessageResponse,
  ClearSessionResponse,
} from '../../types';

/**
 * Send a message to the AI chatbot
 * POST /api/chat/messages
 */
export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (request: SendMessageRequest) => {
      console.log('Sending chat message:', request);
      const { data } = await apiClient.post<SendMessageResponse>(
        ENDPOINTS.CHAT.SEND_MESSAGE,
        request
      );
      console.log('Chat response:', JSON.stringify(data, null, 2));
      return data;
    },
  });
};

/**
 * Clear a chat session
 * DELETE /api/chat/sessions/{session_id}
 */
export const useClearSession = () => {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data } = await apiClient.delete<ClearSessionResponse>(
        ENDPOINTS.CHAT.CLEAR_SESSION(sessionId)
      );
      return data;
    },
  });
};
