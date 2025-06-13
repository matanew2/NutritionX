import { useState, useEffect } from 'react';
import { database, DailyData, FoodEntry, UserProfile } from '@/utils/database';

interface CalendarData {
  date: string;
  waterGlasses: number;
  weight?: number;
  notes?: string;
  foods: FoodEntry[];
  hasData: boolean;
}

interface MarkedDate {
  selected?: boolean;
  selectedColor?: string;
  marked?: boolean;
  dotColor?: string;
}

export const useCalendarData = (date: string) => {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get daily data
        const dailyData = await database.getDailyData(date);
        
        // Get food entries
        const foodEntries = await database.getFoodEntries(date);
        
        // Get user profile for calorie calculations
        const userProfile = await database.getUserProfile();

        if (dailyData || foodEntries.length > 0) {
          setData({
            date,
            waterGlasses: dailyData?.waterGlasses || 0,
            weight: dailyData?.weight,
            notes: dailyData?.notes,
            foods: foodEntries,
            hasData: true
          });
        } else {
          setData({
            date,
            waterGlasses: 0,
            foods: [],
            hasData: false
          });
        }
      } catch (err) {
        console.error('Error loading calendar data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [date]);

  return { data, loading, error };
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