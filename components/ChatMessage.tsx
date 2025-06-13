import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
  const formatMessage = (text: string) => {
    // Split text into parts (text and emojis)
    const parts = text.split(/([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}])/gu);
    
    return parts.map((part, index) => {
      // Check if the part is an emoji
      const isEmoji = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}]/gu.test(part);
      
      // Check if the part is a bold text (wrapped in **)
      const isBold = part.startsWith('**') && part.endsWith('**');
      const boldText = isBold ? part.slice(2, -2) : part;

      return (
        <Text
          key={index}
          style={[
            styles.messageText,
            {
              color: message.isUser ? 'white' : colors.text,
              fontSize: isEmoji ? 24 : 16,
              fontFamily: isBold ? 'Inter-Bold' : 'Inter-Regular',
            },
          ]}
        >
          {isBold ? boldText : part}
        </Text>
      );
    });
  };

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
      
      <Pressable
        style={[
          styles.bubble,
          {
            backgroundColor: message.isUser ? colors.primary : colors.surface,
            marginLeft: message.isUser ? 40 : 12,
            marginRight: message.isUser ? 0 : 40,
          },
        ]}
      >
        <View style={styles.messageContent}>
          {formatMessage(message.text)}
        </View>
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
      </Pressable>
      
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
  messageContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  messageText: {
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    textAlign: 'right',
  },
});