// Chat-related types matching backend API

// ============================================
// CHAT MESSAGE
// ============================================

export interface ToolCall {
  tool_name: string;
  arguments: Record<string, any>;
  result: any;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  tool_calls?: ToolCall[] | null;
  timestamp: string;
}

// ============================================
// SEND MESSAGE
// ============================================

export interface SendMessageRequest {
  message: string;
  session_id?: string;
}

export interface SendMessageResponse {
  session_id: string;
  message: string;
  tool_calls_executed: string[];
  timestamp: string;
}

// ============================================
// CHAT HISTORY
// ============================================

export interface ChatHistoryResponse {
  session_id: string;
  messages: ChatMessage[];
  total_messages: number;
}

// ============================================
// CLEAR SESSION
// ============================================

export interface ClearSessionResponse {
  message: string;
  deleted_messages: number;
}
