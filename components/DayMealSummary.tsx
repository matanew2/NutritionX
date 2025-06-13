import React from 'react';
import { View, Text, StyleSheet, useColorScheme, Image, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';

interface DayMealSummaryProps {
  date: string;
}

export function DayMealSummary({ date }: DayMealSummaryProps) {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    primary: '#4F46E5',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
    success: '#10B981',
  };

  // Mock data for the selected date
  const dayData = {
    totalCalories: 0,
    targetCalories: 0,
    meals: [],
  };

  const remainingCalories = dayData.targetCalories - dayData.totalCalories;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Daily Summary */}
      <View style={styles.summaryHeader}>
        <View>
          <Text style={[styles.calorieCount, { color: colors.text }]}>
            {dayData.totalCalories} / {dayData.targetCalories} cal
          </Text>
          <Text style={[styles.remainingText, { color: colors.textSecondary }]}>
            {remainingCalories > 0 ? `${remainingCalories} remaining` : 'Goal exceeded!'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
          <Text style={[styles.statusText, { color: colors.success }]}>
            On Track
          </Text>
        </View>
      </View>

      {/* Meals List */}
      <View style={styles.mealsList}>
        {dayData.meals.map((meal, index) => (
          <TouchableOpacity
            key={meal.id}
            style={[
              styles.mealItem,
              index < dayData.meals.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={() => router.push(`/meal-details?id=${meal.id}`)}
          >
            <Image source={{ uri: meal.image }} style={styles.mealImage} />
            
            <View style={styles.mealInfo}>
              <Text style={[styles.mealType, { color: colors.textSecondary }]}>
                {meal.type}
              </Text>
              <Text style={[styles.mealName, { color: colors.text }]}>
                {meal.name}
              </Text>
              <Text style={[styles.mealTime, { color: colors.textSecondary }]}>
                {meal.time} • {meal.calories} cal
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        
        {/* Add Meal Button */}
        <TouchableOpacity
          style={styles.addMealButton}
          onPress={() => router.push('/add-meal')}
        >
          <View style={[styles.addIcon, { backgroundColor: colors.primary }]}>
            <Plus size={16} color="white" />
          </View>
          <Text style={[styles.addMealText, { color: colors.textSecondary }]}>
            Add meal or snack
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieCount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  remainingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  mealsList: {
    gap: 0,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  mealImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mealName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  mealTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  addIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addMealText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});