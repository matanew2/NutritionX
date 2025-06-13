import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  date?: string;
  progress?: number;
}

interface AchievementCardProps {
  achievement: Achievement;
  colors: {
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    success: string;
    border: string;
  };
}

export function AchievementCard({ achievement, colors }: AchievementCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: achievement.completed ? colors.success : colors.border,
          borderWidth: achievement.completed ? 2 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{achievement.icon}</Text>
        {achievement.completed && (
          <View style={[styles.checkBadge, { backgroundColor: colors.success }]}>
            <Check size={12} color="white" />
          </View>
        )}
      </View>
      
      <Text style={[styles.title, { color: colors.text }]}>
        {achievement.title}
      </Text>
      
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {achievement.description}
      </Text>
      
      {achievement.completed ? (
        <Text style={[styles.completedDate, { color: colors.success }]}>
          Completed {achievement.date}
        </Text>
      ) : achievement.progress !== undefined ? (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${achievement.progress * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {Math.round(achievement.progress * 100)}%
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
    marginBottom: 8,
  },
  completedDate: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    textAlign: 'right',
  },
});