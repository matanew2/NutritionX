import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { CircularProgress } from './CircularProgress';

interface FunCalorieRingProps {
  consumed: number;
  target: number;
}

export function FunCalorieRing({ consumed, target }: FunCalorieRingProps) {
  const colorScheme = useColorScheme();
  const progress = Math.min(consumed / target, 1);
  const remaining = Math.max(target - consumed, 0);
  
  const colors = {
    background: colorScheme === 'dark' ? '#1F1F1F' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    ring: progress >= 1 ? '#10B981' : '#4F46E5',
    ringBg: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
  };

  const getEmoji = () => {
    if (progress >= 1) return '🎉';
    if (progress >= 0.8) return '🔥';
    if (progress >= 0.5) return '💪';
    if (progress >= 0.2) return '🌱';
    return '🍽️';
  };

  const getMessage = () => {
    if (progress >= 1) return 'Goal smashed!';
    if (progress >= 0.8) return 'Almost there!';
    if (progress >= 0.5) return 'Halfway hero!';
    if (progress >= 0.2) return 'Good start!';
    return 'Let\'s fuel up!';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.ringContainer}>
        <CircularProgress
          progress={progress}
          size={120}
          strokeWidth={12}
          color={colors.ring}
          backgroundColor={colors.ringBg}
        />
        <View style={styles.centerContent}>
          <Text style={styles.emoji}>{getEmoji()}</Text>
          <Text style={[styles.consumed, { color: colors.text }]}>
            {consumed}
          </Text>
          <Text style={[styles.target, { color: colors.textSecondary }]}>
            / {target}
          </Text>
        </View>
      </View>
      
      <View style={styles.info}>
        <Text style={[styles.message, { color: colors.text }]}>
          {getMessage()}
        </Text>
        {remaining > 0 && (
          <Text style={[styles.remaining, { color: colors.textSecondary }]}>
            {remaining} calories to go
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  ringContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  consumed: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  target: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  info: {
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  remaining: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});