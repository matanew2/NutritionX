import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  age: number;
  height: string;
  currentWeight: number;
  goalWeight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  dailyCalorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  waterTarget: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
  image?: string;
}

export interface DailyData {
  date: string;
  foods: FoodEntry[];
  waterGlasses: number;
  weight?: number;
  notes?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
}

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  DAILY_DATA: 'daily_data_',
  ACHIEVEMENTS: 'achievements',
  STREAK_DATA: 'streak_data',
};

// User Profile
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Daily Data
export const saveDailyData = async (date: string, data: DailyData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_DATA + date, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving daily data:', error);
  }
};

export const getDailyData = async (date: string): Promise<DailyData | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_DATA + date);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting daily data:', error);
    return null;
  }
};

// Food Entries
export const addFoodEntry = async (date: string, food: FoodEntry): Promise<void> => {
  try {
    const dailyData = await getDailyData(date) || {
      date,
      foods: [],
      waterGlasses: 0,
    };
    
    dailyData.foods.push(food);
    await saveDailyData(date, dailyData);
  } catch (error) {
    console.error('Error adding food entry:', error);
  }
};

export const removeFoodEntry = async (date: string, foodId: string): Promise<void> => {
  try {
    const dailyData = await getDailyData(date);
    if (dailyData) {
      dailyData.foods = dailyData.foods.filter(food => food.id !== foodId);
      await saveDailyData(date, dailyData);
    }
  } catch (error) {
    console.error('Error removing food entry:', error);
  }
};

// Water Tracking
export const updateWaterIntake = async (date: string, glasses: number): Promise<void> => {
  try {
    const dailyData = await getDailyData(date) || {
      date,
      foods: [],
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
      foods: [],
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
    await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
};

export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : getDefaultAchievements();
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
    
    const streakData = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_DATA);
    const currentStreak = streakData ? JSON.parse(streakData) : { count: 0, lastDate: null };
    
    const todayData = await getDailyData(today);
    const hasLoggedToday = todayData && todayData.foods.length > 0;
    
    if (hasLoggedToday) {
      if (currentStreak.lastDate === yesterday) {
        currentStreak.count += 1;
      } else if (currentStreak.lastDate !== today) {
        currentStreak.count = 1;
      }
      currentStreak.lastDate = today;
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(currentStreak));
    return currentStreak.count;
  } catch (error) {
    console.error('Error updating streak:', error);
    return 0;
  }
};

// Helper Functions
export const getDateRange = (days: number): string[] => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
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
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};