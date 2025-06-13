import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

interface MacroData {
  protein: { consumed: number; target: number };
  carbs: { consumed: number; target: number };
  fat: { consumed: number; target: number };
}

interface QuickMacrosProps {
  macros: MacroData;
}

export function QuickMacros({ macros }: QuickMacrosProps) {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    protein: '#10B981',
    carbs: '#F59E0B',
    fat: '#EF4444',
  };

  const macroItems = [
    { 
      name: 'Protein', 
      emoji: '💪', 
      color: colors.protein,
      consumed: macros.protein.consumed,
      target: macros.protein.target,
    },
    { 
      name: 'Carbs', 
      emoji: '⚡', 
      color: colors.carbs,
      consumed: macros.carbs.consumed,
      target: macros.carbs.target,
    },
    { 
      name: 'Fat', 
      emoji: '🥑', 
      color: colors.fat,
      consumed: macros.fat.consumed,
      target: macros.fat.target,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Today's Fuel ⛽
      </Text>
      
      <View style={styles.macroGrid}>
        {macroItems.map((macro) => {
          const progress = Math.min(macro.consumed / macro.target, 1);
          
          return (
            <View key={macro.name} style={[styles.macroCard, { backgroundColor: colors.surface }]}>
              <Text style={styles.emoji}>{macro.emoji}</Text>
              <Text style={[styles.macroName, { color: colors.textSecondary }]}>
                {macro.name}
              </Text>
              <Text style={[styles.macroValue, { color: colors.text }]}>
                {macro.consumed}g
              </Text>
              <View style={[styles.progressBar, { backgroundColor: macro.color + '20' }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: macro.color,
                      width: `${progress * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.target, { color: colors.textSecondary }]}>
                / {macro.target}g
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  macroName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  target: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
});