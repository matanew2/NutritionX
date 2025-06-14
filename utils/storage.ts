import { database, UserProfile, FoodEntry, DailyData, Achievement } from './database';

const STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  DAILY_DATA: 'dailyData',
  ACHIEVEMENTS: 'achievements',
  STREAK_DATA: 'streak_data',
};

// User Profile
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  await database.saveUserProfile(profile);
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  return await database.getUserProfile();
};

// Daily Data
export const saveDailyData = async (date: string, data: DailyData): Promise<void> => {
  await database.saveDailyData({
    ...data,
    date,
  });
};

export const getDailyData = async (date: string): Promise<DailyData | null> => {
  return await database.getDailyData(date);
};

// Food Entries
export const addFoodEntry = async (date: string, food: FoodEntry): Promise<void> => {
  try {
    await database.saveFoodEntry({
      ...food,
      date,
    });
  } catch (error) {
    console.error('Error adding food entry:', error);
  }
};

export const removeFoodEntry = async (date: string, foodId: number): Promise<void> => {
  try {
    await database.deleteFoodEntry(foodId);
  } catch (error) {
    console.error('Error removing food entry:', error);
  }
};

// Water Tracking
export const updateWaterIntake = async (date: string, glasses: number): Promise<void> => {
  try {
    const dailyData = await getDailyData(date) || {
      date,
      waterGlasses: 0,
    };
    
    dailyData.waterGlasses = glasses;
    await saveDailyData(date, dailyData);
  } catch (error) {
    console.error('Error updating water intake:', error);
  }
};

// Weight Tracking
export const addWeightEntry = async (date: string, weight: number): Promise<void> => {
  try {
    const dailyData = await getDailyData(date) || {
      date,
      waterGlasses: 0,
    };
    
    dailyData.weight = weight;
    await saveDailyData(date, dailyData);
  } catch (error) {
    console.error('Error adding weight entry:', error);
  }
};

// Achievements
export const saveAchievements = async (achievements: Achievement[]): Promise<void> => {
  try {
    await database.saveAchievements(achievements);
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
};

export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const achievements = await database.getAchievements();
    return achievements.length > 0 ? achievements : getDefaultAchievements();
  } catch (error) {
    console.error('Error getting achievements:', error);
    return getDefaultAchievements();
  }
};

// Streak Data
export const updateStreak = async (): Promise<number> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const streakData = await database.getStreakData();
    const currentStreak = streakData ? streakData : { 
      currentStreak: 0, 
      longestStreak: 0, 
      lastLogDate: null, 
      totalDaysLogged: 0 
    };
    
    const todayFoodEntries = await database.getFoodEntries(today);
    const hasLoggedToday = todayFoodEntries && todayFoodEntries.length > 0;
    
    if (hasLoggedToday) {
      if (currentStreak.lastLogDate === yesterday) {
        currentStreak.currentStreak += 1;
      } else if (currentStreak.lastLogDate !== today) {
        currentStreak.currentStreak = 1;
      }
      currentStreak.lastLogDate = today;
      currentStreak.totalDaysLogged += 1;
      
      if (currentStreak.currentStreak > currentStreak.longestStreak) {
        currentStreak.longestStreak = currentStreak.currentStreak;
      }
    }
    
    await database.saveStreakData(currentStreak);
    return currentStreak.currentStreak;
  } catch (error) {
    console.error('Error updating streak:', error);
    return 0;
  }
};

// Helper Functions
export const getDateRange = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

export const calculateDailyTotals = (foods: FoodEntry[]) => {
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

const getDefaultAchievements = (): Achievement[] => [
  {
    id: 'first_meal',
    title: 'First Bite! 🍽️',
    description: 'Log your first meal',
    icon: '🍽️',
    progress: 0,
    target: 1,
  },
  {
    id: 'water_warrior',
    title: 'Water Warrior 💧',
    description: 'Drink 8 glasses of water in a day',
    icon: '💧',
    progress: 0,
    target: 8,
  },
  {
    id: 'week_streak',
    title: 'Week Warrior 🔥',
    description: 'Log meals for 7 days straight',
    icon: '🔥',
    progress: 0,
    target: 7,
  },
  {
    id: 'protein_power',
    title: 'Protein Power 💪',
    description: 'Hit your protein goal 5 times',
    icon: '💪',
    progress: 0,
    target: 5,
  },
];

// Clear all data (for testing)
export const clearAllData = async (): Promise<void> => {
  await database.clearAllData();
};

// Export types for convenience
export type { Achievement, UserProfile, FoodEntry, DailyData };