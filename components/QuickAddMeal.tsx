import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Coffee, Sun, Sunset, Moon } from 'lucide-react-native';
import { router } from 'expo-router';

export function QuickAddMeal() {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
  };

  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast', icon: Coffee, color: '#F59E0B' },
    { id: 'lunch', name: 'Lunch', icon: Sun, color: '#EAB308' },
    { id: 'dinner', name: 'Dinner', icon: Sunset, color: '#F97316' },
    { id: 'snack', name: 'Snack', icon: Moon, color: '#8B5CF6' },
  ];

  const handleMealPress = (mealType: string) => {
    router.push(`/add-meal?type=${mealType}`);
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Quick Add Meal
      </Text>
      
      <View style={styles.mealGrid}>
        {mealTypes.map((meal) => {
          const IconComponent = meal.icon;
          return (
            <TouchableOpacity
              key={meal.id}
              style={[styles.mealButton, { backgroundColor: colors.surface }]}
              onPress={() => handleMealPress(meal.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: meal.color + '20' }]}>
                <IconComponent size={24} color={meal.color} />
              </View>
              <Text style={[styles.mealName, { color: colors.text }]}>
                {meal.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  mealGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});