import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Sparkles, Heart } from 'lucide-react-native';

interface PlayfulHeaderProps {
  userName?: string;
  streak: number;
}

export function PlayfulHeader({ userName = 'Friend', streak }: PlayfulHeaderProps) {
  const colorScheme = useColorScheme();
  
  const colors = {
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    accent: '#FF6B6B',
    streak: '#FFD93D',
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    if (streak === 0) return "Let's start your journey! 🌟";
    if (streak < 3) return "You're getting started! 💪";
    if (streak < 7) return "Building great habits! 🔥";
    if (streak < 14) return "You're on fire! 🚀";
    return "Absolutely crushing it! 🏆";
  };

  return (
    <View style={styles.container}>
      <View style={styles.greetingSection}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
          {getGreeting()}
        </Text>
        <View style={styles.nameRow}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {userName}
          </Text>
          <Heart size={20} color={colors.accent} fill={colors.accent} />
        </View>
      </View>
      
      {streak > 0 && (
        <View style={[styles.streakBadge, { backgroundColor: colors.streak + '20' }]}>
          <Sparkles size={16} color={colors.streak} />
          <Text style={[styles.streakText, { color: colors.streak }]}>
            {streak} day{streak !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
      
      <Text style={[styles.motivation, { color: colors.textSecondary }]}>
        {getMotivationalMessage()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greetingSection: {
    marginBottom: 8,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginRight: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  streakText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  motivation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
});