import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bot, User } from 'lucide-react-native';

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

export function ChatMessage({ message, colors }: ChatMessageProps) {
  return (
    <View style={[
      styles.container,
      message.isUser ? styles.userMessage : styles.botMessage,
    ]}>
      {!message.isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Bot size={16} color="white" />
        </View>
      )}
      
      <View style={[
        styles.bubble,
        {
          backgroundColor: message.isUser ? colors.primary : colors.surface,
          marginLeft: message.isUser ? 40 : 12,
          marginRight: message.isUser ? 0 : 40,
        },
      ]}>
        <Text style={[
          styles.messageText,
          {
            color: message.isUser ? 'white' : colors.text,
          },
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.timestamp,
          {
            color: message.isUser ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
          },
        ]}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
      
      {message.isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <User size={16} color="white" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    textAlign: 'right',
  },
});