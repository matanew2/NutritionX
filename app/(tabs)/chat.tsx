import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, Smile } from 'lucide-react-native';
import { ChatMessage } from '@/components/ChatMessage';
import { SuggestedQuestions } from '@/components/SuggestedQuestions';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  colors: {
    primary: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
}

interface Colors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  inputBackground: string;
}

const GROQ_API_KEY = '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';

const EMOJI_CATEGORIES = {
  '😊': ['😊', '😄', '😃', '😀', '😁', '😆', '😅', '😂', '🤣', '😊'],
  '🍎': ['🍎', '🥗', '🥑', '🥦', '🥕', '🥬', '🥒', '🥝', '🍇', '🍓'],
  '💪': ['💪', '🏃', '🏋️', '🧘', '🚶', '🏃‍♀️', '🏋️‍♀️', '🧘‍♀️', '🚶‍♀️', '💪'],
  '🎯': ['🎯', '⭐', '🌟', '✨', '💫', '🔥', '💯', '✅', '🎉', '🏆'],
};

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI nutrition assistant. I can help you with meal planning, nutritional information, dietary advice, and answer any questions about your health goals. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('😊');

  const colors: Colors = {
    background: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    primary: '#4F46E5',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
    inputBackground: colorScheme === 'dark' ? '#374151' : '#F3F4F6',
  };

  const getAIResponse = async (userInput: string): Promise<string> => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'compound-beta',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI nutrition assistant. You provide accurate, evidence-based advice about nutrition, meal planning, and health goals. Keep responses concise and practical.'
            },
            ...messages.map((msg: Message) => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: userInput
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev: Message[]) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  const insertEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerContent}>
            <View style={[styles.botAvatar, { backgroundColor: colors.primary }]}>
              <Bot size={20} color="white" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                AI Nutrition Assistant
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Always here to help
              </Text>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
          ref={scrollViewRef}
        >
          {messages.map((message) => (
            <ChatMessage
              message={message}
              colors={{
                primary: colors.primary,
                surface: colors.surface,
                text: colors.text,
                textSecondary: colors.textSecondary,
              }}
            />
          ))}
          
          {isTyping && (
            <View style={styles.typingIndicator}>
              <View style={[styles.botAvatar, { backgroundColor: colors.primary }]}>
                <Bot size={16} color="white" />
              </View>
              <View style={[styles.typingBubble, { backgroundColor: colors.surface }]}>
                <Text style={[styles.typingText, { color: colors.textSecondary }]}>
                  AI is typing...
                </Text>
              </View>
            </View>
          )}

          {messages.length === 1 && (
            <SuggestedQuestions onQuestionPress={handleSuggestedQuestion} />
          )}
        </ScrollView>

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={[styles.emojiButton, { backgroundColor: colors.inputBackground }]}
              onPress={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.inputBackground, color: colors.text }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about nutrition, meals, or health goals..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Send size={20} color="white" />
            </TouchableOpacity>
          </View>

          {showEmojiPicker && (
            <View style={[styles.emojiPicker, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.emojiCategories}>
                {Object.keys(EMOJI_CATEGORIES).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.emojiCategory,
                      selectedEmojiCategory === category && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setSelectedEmojiCategory(category)}
                  >
                    <Text style={styles.emojiCategoryText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.emojiGrid}>
                {EMOJI_CATEGORIES[selectedEmojiCategory as keyof typeof EMOJI_CATEGORIES].map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={styles.emojiItem}
                    onPress={() => insertEmoji(emoji)}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  typingBubble: {
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
  },
  typingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emojiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiPicker: {
    borderTopWidth: 1,
    padding: 12,
  },
  emojiCategories: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  emojiCategory: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  emojiCategoryText: {
    fontSize: 20,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  emojiItem: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 24,
  },
});