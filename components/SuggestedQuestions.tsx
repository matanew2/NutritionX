import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

interface SuggestedQuestionsProps {
  onQuestionPress: (question: string) => void;
}

export function SuggestedQuestions({ onQuestionPress }: SuggestedQuestionsProps) {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    primary: '#4F46E5',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
  };

  const questions = [
    "What should I eat for breakfast?",
    "How many calories should I eat daily?",
    "What are good protein sources?",
    "Help me plan meals for weight loss",
    "How much water should I drink?",
    "What are healthy snack options?",
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        Try asking about:
      </Text>
      
      <View style={styles.questionsGrid}>
        {questions.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.questionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => onQuestionPress(question)}
          >
            <Text style={[styles.questionText, { color: colors.text }]}>
              {question}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 12,
    textAlign: 'center',
  },
  questionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  questionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    margin: 4,
  },
  questionText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
});