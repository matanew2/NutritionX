import { useState, useEffect } from 'react';
import { getDailyData, getDateRange, calculateDailyTotals } from '@/utils/storage';

interface CalendarData {
  date: string;
  foods: any[];
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
          const dailyData = await getDailyData(date);
          return {
            date,
            foods: dailyData?.foods || [],
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

      data.forEach((day) => {
        if (day.foods.length > 0) {
          const totals = calculateDailyTotals(day.foods);
          const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
          const targetCalories = userProfile.dailyCalorieTarget || 2000;

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