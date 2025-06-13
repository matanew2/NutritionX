import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

interface QuickAddFoodProps {
  onAddFood: (food: { name: string; calories: number; protein: number; carbs: number; fat: number; mealType: string }) => void;
}

export function QuickAddFood({ onAddFood }: QuickAddFoodProps) {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
  };

  const quickFoods = [
    { name: 'Banana 🍌', calories: 105, protein: 1, carbs: 27, fat: 0, mealType: 'snack' },
    { name: 'Greek Yogurt 🥛', calories: 130, protein: 15, carbs: 9, fat: 5, mealType: 'snack' },
    { name: 'Apple 🍎', calories: 80, protein: 0, carbs: 21, fat: 0, mealType: 'snack' },
    { name: 'Almonds 🥜', calories: 160, protein: 6, carbs: 6, fat: 14, mealType: 'snack' },
    { name: 'Oatmeal 🥣', calories: 150, protein: 5, carbs: 27, fat: 3, mealType: 'breakfast' },
    { name: 'Chicken Breast 🍗', calories: 165, protein: 31, carbs: 0, fat: 4, mealType: 'lunch' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Quick Add 🚀
      </Text>
      
      <View style={styles.foodGrid}>
        {quickFoods.map((food, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.foodButton, { backgroundColor: colors.surface }]}
            onPress={() => onAddFood(food)}
          >
            <Text style={[styles.foodName, { color: colors.text }]}>
              {food.name}
            </Text>
            <Text style={[styles.foodCalories, { color: colors.textSecondary }]}>
              {food.calories} cal
            </Text>
          </TouchableOpacity>
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
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  foodButton: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  foodName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    textAlign: 'center',
  },
  foodCalories: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});