import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

// Open the database
const db = SQLite.openDatabase('nutrition.db');

// Initialize database tables
export const initDatabase = async () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      // User Profile table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS user_profile (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          age INTEGER,
          gender TEXT,
          height REAL,
          weight REAL,
          activityLevel TEXT,
          goal TEXT,
          dailyCalorieTarget INTEGER,
          dailyProteinTarget INTEGER,
          dailyCarbsTarget INTEGER,
          dailyFatTarget INTEGER
        )`
      );

      // Food Entries table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS food_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT,
          name TEXT,
          calories INTEGER,
          protein REAL,
          carbs REAL,
          fat REAL,
          servingSize REAL,
          servingUnit TEXT,
          mealType TEXT
        )`
      );

      // Daily Data table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS daily_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT UNIQUE,
          waterGlasses INTEGER DEFAULT 0,
          weight REAL,
          notes TEXT
        )`
      );
    }, 
    (error) => {
      console.error('Error initializing database:', error);
      reject(error);
    },
    () => {
      console.log('Database initialized successfully');
      resolve();
    });
  });
};

// User Profile operations
export const saveUserProfile = async (profile: UserProfile) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT OR REPLACE INTO user_profile (
          name, age, gender, height, weight, activityLevel,
          goal, dailyCalorieTarget, dailyProteinTarget,
          dailyCarbsTarget, dailyFatTarget
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          profile.name,
          profile.age,
          profile.gender,
          profile.height,
          profile.weight,
          profile.activityLevel,
          profile.goal,
          profile.dailyCalorieTarget,
          profile.dailyProteinTarget,
          profile.dailyCarbsTarget,
          profile.dailyFatTarget
        ]
      );
    }, 
    (error) => {
      console.error('Error saving user profile:', error);
      reject(error);
    },
    () => {
      resolve();
    });
  });
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM user_profile ORDER BY id DESC LIMIT 1',
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0) as UserProfile);
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          console.error('Error getting user profile:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Food Entries operations
export const saveFoodEntry = async (entry: FoodEntry) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO food_entries (
          date, name, calories, protein, carbs, fat,
          servingSize, servingUnit, mealType
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          entry.date,
          entry.name,
          entry.calories,
          entry.protein,
          entry.carbs,
          entry.fat,
          entry.servingSize,
          entry.servingUnit,
          entry.mealType
        ]
      );
    },
    (error) => {
      console.error('Error saving food entry:', error);
      reject(error);
    },
    () => {
      resolve();
    });
  });
};

export const getFoodEntries = async (date: string): Promise<FoodEntry[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM food_entries WHERE date = ? ORDER BY id DESC',
        [date],
        (_, { rows }) => {
          const entries: FoodEntry[] = [];
          for (let i = 0; i < rows.length; i++) {
            entries.push(rows.item(i) as FoodEntry);
          }
          resolve(entries);
        },
        (_, error) => {
          console.error('Error getting food entries:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteFoodEntry = async (id: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM food_entries WHERE id = ?',
        [id]
      );
    },
    (error) => {
      console.error('Error deleting food entry:', error);
      reject(error);
    },
    () => {
      resolve();
    });
  });
};

// Daily Data operations
export const saveDailyData = async (data: DailyData) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT OR REPLACE INTO daily_data (
          date, waterGlasses, weight, notes
        ) VALUES (?, ?, ?, ?)`,
        [
          data.date,
          data.waterGlasses,
          data.weight,
          data.notes
        ]
      );
    },
    (error) => {
      console.error('Error saving daily data:', error);
      reject(error);
    },
    () => {
      resolve();
    });
  });
};

export const getDailyData = async (date: string): Promise<DailyData | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM daily_data WHERE date = ?',
        [date],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0) as DailyData);
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          console.error('Error getting daily data:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Types
export interface UserProfile {
  id?: number;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  goal: string;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbsTarget: number;
  dailyFatTarget: number;
}

export interface FoodEntry {
  id?: number;
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  servingUnit: string;
  mealType: string;
}

export interface DailyData {
  id?: number;
  date: string;
  waterGlasses: number;
  weight?: number;
  notes?: string;
}

// Initialize database when the module is imported
initDatabase().catch(console.error); 