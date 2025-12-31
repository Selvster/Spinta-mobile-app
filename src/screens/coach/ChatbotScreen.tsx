import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';

const ChatbotScreen: React.FC = () => {
  const [message, setMessage] = useState('');

  const quickSuggestions = [
    'Analyze our last match',
    'Create training plan',
    'Suggest tactics',
    'Player performance review',
  ];

  const handleSuggestionPress = (suggestion: string) => {
    // Handle suggestion press - will send the suggestion as a message
    console.log('Suggestion pressed:', suggestion);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message
      console.log('Send message:', message);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.aiIcon}>
          <Ionicons name="flash" size={28} color={COLORS.textOnPrimary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>AI Coach Assistant</Text>
          <Text style={styles.headerSubtitle}>Your tactical companion</Text>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {/* Initial AI Message */}
        <View style={styles.messageContainer}>
          <View style={styles.aiMessage}>
            <Text style={styles.messageText}>
              Hi Coach! I'm your AI assistant. I can help you with tactics, training plans, player analysis, and team management. How can I help you today?
            </Text>
          </View>
        </View>

        {/* Quick Suggestions */}
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
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask about tactics, training, players..."
          placeholderTextColor={COLORS.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
        >
          <Ionicons name="send" size={20} color={COLORS.textOnPrimary} />
        </TouchableOpacity>
      </View>
    </View>
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
    padding: 20,
    paddingTop: 45,
    backgroundColor: COLORS.background,
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
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 30,
  },
  aiMessage: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    maxWidth: '85%',
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
    lineHeight: 22,
  },
  suggestionsSection: {
    marginTop: 10,
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
    paddingVertical: 16,
    paddingHorizontal: 20,
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
});

export default ChatbotScreen;
