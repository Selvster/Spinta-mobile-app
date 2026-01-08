import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { COLORS } from '../../constants';
import { useSendMessage, useClearSession } from '../../api/mutations/chat.mutations';
import { ChatMessage } from '../../types';

const ChatbotScreen: React.FC = () => {
  const [message, setMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const sendMessageMutation = useSendMessage();
  const clearSessionMutation = useClearSession();

  // Typing indicator animation
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      const animateDot = (dot: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const animation = Animated.parallel([
        animateDot(dot1, 0),
        animateDot(dot2, 150),
        animateDot(dot3, 300),
      ]);
      animation.start();

      return () => animation.stop();
    }
  }, [isLoading, dot1, dot2, dot3]);

  const quickSuggestions = [
    'Who are the top scorers?',
    'How did we perform last match?',
    'Which players need improvement?',
    'Analyze team statistics',
  ];

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || message.trim();
    if (!messageText) return;

    // Add user message to local state immediately
    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    scrollToBottom();

    // Send message to API
    sendMessageMutation.mutate(
      {
        message: messageText,
        session_id: sessionId || undefined,
      },
      {
        onSuccess: (response) => {
          // Save session ID for future messages
          if (!sessionId) {
            setSessionId(response.session_id);
          }

          // Add AI response to messages
          const aiMessage: ChatMessage = {
            role: 'assistant',
            content: response.message,
            timestamp: response.timestamp,
          };
          setMessages((prev) => [...prev, aiMessage]);
          setIsLoading(false);
          scrollToBottom();
        },
        onError: (error) => {
          console.error('Chat error:', error);
          setIsLoading(false);
          // Remove the optimistic user message
          setMessages((prev) => prev.slice(0, -1));
          Alert.alert('Error', 'Failed to send message. Please try again.');
        },
      }
    );
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;

    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            if (sessionId) {
              clearSessionMutation.mutate(sessionId, {
                onSuccess: () => {
                  setMessages([]);
                  setSessionId(null);
                },
                onError: () => {
                  // Clear locally even if API fails
                  setMessages([]);
                  setSessionId(null);
                },
              });
            } else {
              setMessages([]);
            }
          },
        },
      ]
    );
  };

  const handleSuggestionPress = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const renderTypingIndicator = () => {
    const dotStyle = (animValue: Animated.Value) => ({
      transform: [
        {
          translateY: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -6],
          }),
        },
      ],
    });

    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <Animated.View style={[styles.typingDot, dotStyle(dot1)]} />
          <Animated.View style={[styles.typingDot, dotStyle(dot2)]} />
          <Animated.View style={[styles.typingDot, dotStyle(dot3)]} />
        </View>
      </View>
    );
  };

  const renderMessage = (msg: ChatMessage, index: number) => {
    const isUser = msg.role === 'user';

    return (
      <View
        key={index}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          {isUser ? (
            <Text style={[styles.messageText, styles.userMessageText]}>
              {msg.content}
            </Text>
          ) : (
            <Markdown style={markdownStyles}>{msg.content}</Markdown>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiIcon}>
            <Ionicons name="flash" size={28} color={COLORS.textOnPrimary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>AI Coach Assistant</Text>
            <Text style={styles.headerSubtitle}>Your tactical companion</Text>
          </View>
        </View>
        {messages.length > 0 && (
          <TouchableOpacity onPress={handleClearChat} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={22} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </View>

      {/* Chat Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Initial AI Message - always show */}
        <View style={[styles.messageContainer, styles.aiMessageContainer]}>
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <Text style={styles.messageText}>
              Hi Coach! I'm your AI assistant. I can help you analyze player performance,
              team statistics, match results, and more. Ask me anything about your team!
            </Text>
          </View>
        </View>

        {/* Quick Suggestions - only show when no messages */}
        {messages.length === 0 && (
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsLabel}>Quick suggestions:</Text>
            <View style={styles.suggestionsGrid}>
              {quickSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionButton}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Messages */}
        {messages.map((msg, index) => renderMessage(msg, index))}

        {/* Typing Indicator */}
        {isLoading && renderTypingIndicator()}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about players, matches, stats..."
          placeholderTextColor={COLORS.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!message.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={() => handleSendMessage()}
          disabled={!message.trim() || isLoading}
        >
          <Ionicons name="send" size={20} color={COLORS.textOnPrimary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 45,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aiIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  clearButton: {
    padding: 8,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 14,
    borderRadius: 16,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
    lineHeight: 22,
  },
  userMessageText: {
    color: COLORS.textOnPrimary,
  },
  suggestionsSection: {
    marginTop: 20,
  },
  suggestionsLabel: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  suggestionButton: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 14,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

// Markdown styles for AI messages
const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
    lineHeight: 22,
  },
  heading1: {
    fontSize: 20,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 4,
  },
  heading2: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 4,
  },
  heading3: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginTop: 6,
    marginBottom: 2,
  },
  strong: {
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
  },
  em: {
    fontStyle: 'italic',
  },
  bullet_list: {
    marginTop: 4,
    marginBottom: 4,
  },
  ordered_list: {
    marginTop: 4,
    marginBottom: 4,
  },
  list_item: {
    marginBottom: 4,
    flexDirection: 'row',
  },
  bullet_list_icon: {
    marginRight: 8,
    color: COLORS.text,
  },
  ordered_list_icon: {
    marginRight: 8,
    color: COLORS.text,
  },
  code_inline: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 13,
    color: COLORS.primary,
  },
  code_block: {
    backgroundColor: COLORS.border,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontFamily: 'monospace',
    fontSize: 13,
    color: COLORS.text,
  },
  fence: {
    backgroundColor: COLORS.border,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontFamily: 'monospace',
    fontSize: 13,
    color: COLORS.text,
  },
  blockquote: {
    backgroundColor: COLORS.backgroundSecondary,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    paddingLeft: 12,
    paddingVertical: 4,
    marginVertical: 8,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  hr: {
    backgroundColor: COLORS.border,
    height: 1,
    marginVertical: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginVertical: 8,
  },
  thead: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  th: {
    padding: 8,
    fontFamily: 'FranklinGothic-Heavy',
  },
  td: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default ChatbotScreen;
