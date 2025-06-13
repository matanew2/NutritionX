import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Image } from 'react-native';
import { Clock, Trash2 } from 'lucide-react-native';
import { FoodEntry } from '@/utils/storage';

interface TodaysMealsProps {
  meals: FoodEntry[];
  onRemoveMeal?: (mealId: string) => void;
}

export function TodaysMeals({ meals, onRemoveMeal }: TodaysMealsProps) {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
    danger: '#EF4444',
  };

  const getMealEmoji = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍿';
      default: return '🍽️';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (meals.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          Today's Meals 🍽️
        </Text>
        <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No meals logged yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Add your first meal to get started!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Today's Meals 🍽️
      </Text>
      
      <View style={[styles.mealsList, { backgroundColor: colors.surface }]}>
        {meals.map((meal, index) => (
          <View
            key={meal.id}
            style={[
              styles.mealItem,
              index < meals.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={styles.mealContent}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealEmoji}>
                  {getMealEmoji(meal.mealType)}
                </Text>
                <View style={styles.mealInfo}>
                  <Text style={[styles.mealName, { color: colors.text }]}>
                    {meal.name}
                  </Text>
                  <View style={styles.mealMeta}>
                    <Clock size={12} color={colors.textSecondary} />
                    <Text style={[styles.mealTime, { color: colors.textSecondary }]}>
                      {formatTime(meal.timestamp)}
                    </Text>
                    <Text style={[styles.mealCalories, { color: colors.textSecondary }]}>
                      • {meal.calories} cal
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.macroRow}>
                <Text style={[styles.macroText, { color: colors.textSecondary }]}>
                  P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                </Text>
              </View>
            </View>
            
            {onRemoveMeal && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onRemoveMeal(meal.id)}
              >
                <Trash2 size={16} color={colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        ))}
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
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  mealsList: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  mealContent: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  mealMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  mealCalories: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  macroRow: {
    marginLeft: 36,
  },
  macroText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
});