import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Target } from 'lucide-react-native';

interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  progress: number;
  colors: {
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    border: string;
  };
}

export function GoalCard({ title, current, target, unit, progress, colors }: GoalCardProps) {
  const remaining = target - current;
  
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Target size={20} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            {title}
          </Text>
        </View>
        
        <Text style={[styles.remaining, { color: colors.textSecondary }]}>
          {remaining > 0 ? `${remaining} ${unit} to go` : 'Goal achieved!'}
        </Text>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.values}>
          <Text style={[styles.currentValue, { color: colors.text }]}>
            {current} {unit}
          </Text>
          <Text style={[styles.targetValue, { color: colors.textSecondary }]}>
            / {target} {unit}
          </Text>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${Math.min(progress * 100, 100)}%`,
              },
            ]}
          />
        </View>
        
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {Math.round(progress * 100)}% complete
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  remaining: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  progressSection: {
    gap: 8,
  },
  values: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  targetValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
  },
});