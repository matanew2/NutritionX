import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface MacroCardProps {
  title: string;
  value: number;
  target: number;
  unit: string;
  color: string;
  icon: React.ReactNode;
}

export function MacroCard({ title, value, target, unit, color, icon }: MacroCardProps) {
  const colorScheme = useColorScheme();
  const progress = Math.min(value / target, 1);
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        {icon}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      </View>
      
      <Text style={[styles.value, { color: colors.text }]}>
        {value}
        <Text style={[styles.unit, { color: colors.textSecondary }]}>/{target}{unit}</Text>
      </Text>
      
      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: color,
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },
  value: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  unit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});