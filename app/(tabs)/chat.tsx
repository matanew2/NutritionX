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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User } from 'lucide-react-native';
import { ChatMessage } from '@/components/ChatMessage';
import { SuggestedQuestions } from '@/components/SuggestedQuestions';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

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

  const colors = {
    background: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    primary: '#4F46E5',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
    inputBackground: colorScheme === 'dark' ? '#374151' : '#F3F4F6',
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('calorie') || input.includes('calories')) {
      return "Based on your profile, your daily caloric needs are around 2,200 calories. This includes your basal metabolic rate plus your activity level. Would you like me to break down how many calories you should aim for from each macronutrient?";
    }
    
    if (input.includes('protein')) {
      return "For your goals, I recommend 1.2-1.6g of protein per kg of body weight. Good sources include lean meats, fish, eggs, legumes, and dairy. Protein helps with muscle maintenance and keeps you feeling full longer.";
    }
    
    if (input.includes('meal plan') || input.includes('what to eat')) {
      return "I'd be happy to suggest a meal plan! Based on your preferences, here's what I recommend for today:\n\n🍳 Breakfast: Greek yogurt with berries and granola\n🥗 Lunch: Grilled chicken salad with mixed vegetables\n🍽️ Dinner: Baked salmon with quinoa and steamed broccoli\n🍎 Snacks: Apple with almond butter\n\nWould you like me to adjust this based on any dietary restrictions?";
    }
    
    if (input.includes('weight loss') || input.includes('lose weight')) {
      return "For healthy weight loss, aim for a moderate caloric deficit of 300-500 calories per day. Focus on whole foods, increase your protein intake, and stay hydrated. Remember, sustainable weight loss is typically 1-2 pounds per week.";
    }
    
    if (input.includes('water') || input.includes('hydration')) {
      return "Great question! I recommend drinking at least 8 glasses (64oz) of water daily, but this can vary based on your activity level and climate. Proper hydration supports metabolism, helps control hunger, and improves energy levels.";
    }
    
    return "That's a great question! I'm here to help with nutrition advice, meal planning, and dietary guidance. Could you provide more specific details about what you'd like to know? I can help with calorie counting, macro breakdowns, meal suggestions, or any other nutrition-related topics.";
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
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
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              colors={colors}
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
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
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
});