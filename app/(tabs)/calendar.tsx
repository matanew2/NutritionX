import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { DayMealSummary } from '@/components/DayMealSummary';
import { NutrientChart } from '@/components/NutrientChart';
import { useCalendarData } from '@/hooks/useCalendarData';
import { MealSummary } from '@/components/MealSummary';
import { WaterTracker } from '@/components/WaterTracker';
import { useColorScheme } from '@/hooks/useColorScheme';
import { database } from '@/utils/database';
import { format } from 'date-fns';

export default function CalendarScreen() {
  const { colors } = useColorScheme();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { data, loading, error } = useCalendarData(selectedDate);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [_refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(async () => {
    setRefreshKey(prev => prev + 1);
    return Promise.resolve();
  }, []);

  // Update marked dates when data changes
  useEffect(() => {
    const updateMarkedDates = async () => {
      try {
        const userProfile = await database.getUserProfile();
        const targetCalories = userProfile?.dailyCalorieTarget || 2000;
        
        const marked: Record<string, any> = {
          [selectedDate]: {
            selected: true,
            selectedColor: '#4F46E5',
          },
        };

        if (data?.foods && data.foods.length > 0) {
          const totalCalories = data.foods.reduce((sum, food) => sum + food.calories, 0);
          
          // Determine dot color based on calorie goal achievement
          let dotColor = '#EF4444'; // Red for missed goal
          if (totalCalories >= targetCalories * 0.9) {
            dotColor = '#10B981'; // Green for achieved goal
          } else if (totalCalories >= targetCalories * 0.7) {
            dotColor = '#F59E0B'; // Yellow for partial goal
          }

          marked[selectedDate] = {
            ...marked[selectedDate],
            marked: true,
            dotColor,
          };
        }

        setMarkedDates(marked);
      } catch (err) {
        console.error('Error updating marked dates:', err);
      }
    };

    updateMarkedDates();
  }, [data, selectedDate]);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const calendarTheme = {
    backgroundColor: colors.surface,
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: '#FFFFFF',
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.textSecondary,
    dotColor: colors.primary,
    selectedDotColor: '#FFFFFF',
    arrowColor: colors.primary,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontFamily: 'Inter-Regular',
    textMonthFontFamily: 'Inter-SemiBold',
    textDayHeaderFontFamily: 'Inter-Medium',
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Food Calendar
          </Text>
        </View>

        {/* Calendar */}
        <View style={[styles.calendarContainer, { backgroundColor: colors.surface }]}>
          <Calendar
            current={selectedDate}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            theme={calendarTheme}
            renderArrow={(direction) => (
              direction === 'left' ? 
                <ChevronLeft size={20} color={colors.primary} /> :
                <ChevronRight size={20} color={colors.primary} />
            )}
            enableSwipeMonths={true}
            hideExtraDays={true}
            firstDay={1}
          />
        </View>

        {/* Selected Date Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          
          <DayMealSummary date={selectedDate} />
        </View>

        {/* Weekly Nutrient Trends */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Weekly Trends
          </Text>
          <NutrientChart />
        </View>

        <View style={styles.content}>
          <WaterTracker date={selectedDate} onDataChange={handleRefresh} />
          <MealSummary date={selectedDate} onDataChange={handleRefresh} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  legend: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  legendTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  legendItems: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
  },
});