import { useState, useEffect } from 'react';
import { getDailyData, getFoodEntries, getUserProfile } from '@/utils/database';
import { DailyData, FoodEntry, UserProfile } from '@/utils/database';

interface CalendarData {
  date: string;
  foods: FoodEntry[];
  waterGlasses: number;
  weight?: number;
  notes?: string;
}

interface MarkedDate {
  selected?: boolean;
  selectedColor?: string;
  marked?: boolean;
  dotColor?: string;
}

export const useCalendarData = (selectedDate: string) => {
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({});
  const [loading, setLoading] = useState(true);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      // Get data for the last 30 days
      const dates = getDateRange(30);
      const data = await Promise.all(
        dates.map(async (date) => {
          const [dailyData, foodEntries] = await Promise.all([
            getDailyData(date),
            getFoodEntries(date)
          ]);

          return {
            date,
            foods: foodEntries,
            waterGlasses: dailyData?.waterGlasses || 0,
            weight: dailyData?.weight,
            notes: dailyData?.notes,
          };
        })
      );

      setCalendarData(data);

      // Create marked dates for the calendar
      const marked: Record<string, MarkedDate> = {
        [selectedDate]: {
          selected: true,
          selectedColor: '#4F46E5',
        },
      };

      // Get user profile for calorie target
      const userProfile = await getUserProfile();
      const targetCalories = userProfile?.dailyCalorieTarget || 2000;

      data.forEach((day) => {
        if (day.foods.length > 0) {
          const totals = calculateDailyTotals(day.foods);

          // Determine dot color based on calorie goal achievement
          let dotColor = '#EF4444'; // Red for missed goal
          if (totals.calories >= targetCalories * 0.9) {
            dotColor = '#10B981'; // Green for achieved goal
          } else if (totals.calories >= targetCalories * 0.7) {
            dotColor = '#F59E0B'; // Yellow for partial goal
          }

          marked[day.date] = {
            marked: true,
            dotColor,
          };
        }
      });

      setMarkedDates(marked);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, [selectedDate]);

  const getDayData = (date: string) => {
    return calendarData.find(day => day.date === date);
  };

  return {
    calendarData,
    markedDates,
    loading,
    getDayData,
    refreshData: loadCalendarData,
  };
};

const getDateRange = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

const calculateDailyTotals = (foods: FoodEntry[]) => {
  return foods.reduce(
    (totals, food) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}; 