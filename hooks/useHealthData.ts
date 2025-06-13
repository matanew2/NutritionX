import { useState, useEffect } from 'react';
import {
  UserProfile,
  DailyData,
  FoodEntry,
  Achievement,
  getUserProfile,
  getDailyData,
  addFoodEntry,
  updateWaterIntake,
  getAchievements,
  updateStreak,
  calculateDailyTotals,
  getDateRange,
} from '@/utils/storage';

export const useHealthData = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [todayData, setTodayData] = useState<DailyData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    try {
      setLoading(true);
      const [profile, dailyData, userAchievements, currentStreak] = await Promise.all([
        getUserProfile(),
        getDailyData(today),
        getAchievements(),
        updateStreak(),
      ]);

      setUserProfile(profile);
      setTodayData(dailyData);
      setAchievements(userAchievements);
      setStreak(currentStreak);
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addFood = async (food: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    const newFood: FoodEntry = {
      ...food,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    await addFoodEntry(today, newFood);
    await loadData(); // Refresh data
  };

  const updateWater = async (glasses: number) => {
    await updateWaterIntake(today, glasses);
    await loadData(); // Refresh data
  };

  const getDailyTotals = () => {
    if (!todayData || !todayData.foods) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    return calculateDailyTotals(todayData.foods);
  };

  const getWeeklyData = async () => {
    const dates = getDateRange(7);
    const weekData = await Promise.all(
      dates.map(async (date) => {
        const data = await getDailyData(date);
        const totals = data ? calculateDailyTotals(data.foods) : { calories: 0, protein: 0, carbs: 0, fat: 0 };
        return {
          date,
          ...totals,
          waterGlasses: data?.waterGlasses || 0,
          weight: data?.weight,
        };
      })
    );
    return weekData;
  };

  return {
    userProfile,
    todayData,
    achievements,
    streak,
    loading,
    addFood,
    updateWater,
    getDailyTotals,
    getWeeklyData,
    refreshData: loadData,
  };
};