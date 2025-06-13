import SQLite from 'react-native-sqlite-storage';
import { Platform } from 'react-native';

// Enable SQLite debugging
SQLite.DEBUG(true);
// Enable SQLite logging
SQLite.enablePromise(true);

const database_name = 'NutritionApp.db';
const database_version = '1.0';
const database_displayname = 'Nutrition App Database';
const database_size = 200000;

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
  waterTarget: number;
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
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DailyData {
  id?: number;
  date: string;
  waterGlasses: number;
  weight?: number;
  notes?: string;
}

class DatabaseService {
  private database: SQLite.SQLiteDatabase | null = null;

  async initDB(): Promise<SQLite.SQLiteDatabase> {
    if (this.database) {
      return this.database;
    }

    const db = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );

    await this.createTables(db);
    this.database = db;
    return db;
  }

  private async createTables(db: SQLite.SQLiteDatabase): Promise<void> {
    // Create UserProfile table
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        height REAL NOT NULL,
        weight REAL NOT NULL,
        activityLevel TEXT NOT NULL,
        goal TEXT NOT NULL,
        dailyCalorieTarget INTEGER NOT NULL,
        dailyProteinTarget INTEGER NOT NULL,
        dailyCarbsTarget INTEGER NOT NULL,
        dailyFatTarget INTEGER NOT NULL,
        waterTarget INTEGER NOT NULL
      );
    `);

    // Create FoodEntry table
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS food_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        name TEXT NOT NULL,
        calories INTEGER NOT NULL,
        protein REAL NOT NULL,
        carbs REAL NOT NULL,
        fat REAL NOT NULL,
        servingSize REAL NOT NULL,
        servingUnit TEXT NOT NULL,
        mealType TEXT NOT NULL
      );
    `);

    // Create DailyData table
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS daily_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        waterGlasses INTEGER NOT NULL DEFAULT 0,
        weight REAL,
        notes TEXT
      );
    `);
  }

  // User Profile Operations
  async saveUserProfile(profile: UserProfile): Promise<void> {
    const db = await this.initDB();
    const { id, ...profileData } = profile;

    if (id) {
      await db.executeSql(
        `UPDATE user_profile SET 
          name = ?, age = ?, gender = ?, height = ?, weight = ?,
          activityLevel = ?, goal = ?, dailyCalorieTarget = ?,
          dailyProteinTarget = ?, dailyCarbsTarget = ?, dailyFatTarget = ?,
          waterTarget = ?
        WHERE id = ?`,
        [
          profileData.name,
          profileData.age,
          profileData.gender,
          profileData.height,
          profileData.weight,
          profileData.activityLevel,
          profileData.goal,
          profileData.dailyCalorieTarget,
          profileData.dailyProteinTarget,
          profileData.dailyCarbsTarget,
          profileData.dailyFatTarget,
          profileData.waterTarget,
          id,
        ]
      );
    } else {
      await db.executeSql(
        `INSERT INTO user_profile (
          name, age, gender, height, weight, activityLevel, goal,
          dailyCalorieTarget, dailyProteinTarget, dailyCarbsTarget,
          dailyFatTarget, waterTarget
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          profileData.name,
          profileData.age,
          profileData.gender,
          profileData.height,
          profileData.weight,
          profileData.activityLevel,
          profileData.goal,
          profileData.dailyCalorieTarget,
          profileData.dailyProteinTarget,
          profileData.dailyCarbsTarget,
          profileData.dailyFatTarget,
          profileData.waterTarget,
        ]
      );
    }
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const db = await this.initDB();
    const [results] = await db.executeSql('SELECT * FROM user_profile LIMIT 1');
    
    if (results.rows.length === 0) {
      return null;
    }

    return results.rows.item(0);
  }

  // Food Entry Operations
  async saveFoodEntry(entry: FoodEntry): Promise<void> {
    const db = await this.initDB();
    const { id, ...entryData } = entry;

    if (id) {
      await db.executeSql(
        `UPDATE food_entries SET 
          date = ?, name = ?, calories = ?, protein = ?, carbs = ?,
          fat = ?, servingSize = ?, servingUnit = ?, mealType = ?
        WHERE id = ?`,
        [
          entryData.date,
          entryData.name,
          entryData.calories,
          entryData.protein,
          entryData.carbs,
          entryData.fat,
          entryData.servingSize,
          entryData.servingUnit,
          entryData.mealType,
          id,
        ]
      );
    } else {
      await db.executeSql(
        `INSERT INTO food_entries (
          date, name, calories, protein, carbs, fat,
          servingSize, servingUnit, mealType
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          entryData.date,
          entryData.name,
          entryData.calories,
          entryData.protein,
          entryData.carbs,
          entryData.fat,
          entryData.servingSize,
          entryData.servingUnit,
          entryData.mealType,
        ]
      );
    }
  }

  async getFoodEntries(date: string): Promise<FoodEntry[]> {
    const db = await this.initDB();
    const [results] = await db.executeSql(
      'SELECT * FROM food_entries WHERE date = ?',
      [date]
    );

    const entries: FoodEntry[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      entries.push(results.rows.item(i));
    }

    return entries;
  }

  async deleteFoodEntry(id: number): Promise<void> {
    const db = await this.initDB();
    await db.executeSql('DELETE FROM food_entries WHERE id = ?', [id]);
  }

  // Daily Data Operations
  async saveDailyData(data: DailyData): Promise<void> {
    const db = await this.initDB();
    const { id, ...dataWithoutId } = data;

    await db.executeSql(
      `INSERT OR REPLACE INTO daily_data (
        date, waterGlasses, weight, notes
      ) VALUES (?, ?, ?, ?)`,
      [
        dataWithoutId.date,
        dataWithoutId.waterGlasses,
        dataWithoutId.weight,
        dataWithoutId.notes,
      ]
    );
  }

  async getDailyData(date: string): Promise<DailyData | null> {
    const db = await this.initDB();
    const [results] = await db.executeSql(
      'SELECT * FROM daily_data WHERE date = ?',
      [date]
    );

    if (results.rows.length === 0) {
      return null;
    }

    return results.rows.item(0);
  }

  async getDateRange(startDate: string, endDate: string): Promise<DailyData[]> {
    const db = await this.initDB();
    const [results] = await db.executeSql(
      'SELECT * FROM daily_data WHERE date BETWEEN ? AND ?',
      [startDate, endDate]
    );

    const data: DailyData[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      data.push(results.rows.item(i));
    }

    return data;
  }

  // Utility Functions
  async clearAllData(): Promise<void> {
    const db = await this.initDB();
    await db.executeSql('DELETE FROM food_entries');
    await db.executeSql('DELETE FROM daily_data');
    await db.executeSql('DELETE FROM user_profile');
  }
}

export const database = new DatabaseService(); 