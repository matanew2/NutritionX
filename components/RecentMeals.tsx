import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Image } from 'react-native';
import { Clock, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export function RecentMeals() {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
  };

  const recentMeals = [
    {
      id: '1',
      name: 'Greek Yogurt Bowl',
      time: '8:30 AM',
      calories: 320,
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      name: 'Grilled Chicken Salad',
      time: '12:45 PM',
      calories: 450,
      image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '3',
      name: 'Apple & Almond Butter',
      time: '3:15 PM',
      calories: 180,
      image: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Meals
        </Text>
        <TouchableOpacity onPress={() => router.push('/calendar')}>
          <Text style={[styles.viewAll, { color: colors.textSecondary }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        {recentMeals.map((meal, index) => (
          <TouchableOpacity
            key={meal.id}
            style={[
              styles.mealItem,
              index < recentMeals.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={() => router.push(`/meal-details?id=${meal.id}`)}
          >
            <Image source={{ uri: meal.image }} style={styles.mealImage} />
            
            <View style={styles.mealInfo}>
              <Text style={[styles.mealName, { color: colors.text }]}>
                {meal.name}
              </Text>
              <View style={styles.mealMeta}>
                <Clock size={12} color={colors.textSecondary} />
                <Text style={[styles.mealTime, { color: colors.textSecondary }]}>
                  {meal.time}
                </Text>
                <Text style={[styles.mealCalories, { color: colors.textSecondary }]}>
                  • {meal.calories} cal
                </Text>
              </View>
            </View>
            
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  viewAll: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  mealName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
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
});