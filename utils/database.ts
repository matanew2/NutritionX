import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class DatabaseService {
  private static instance: DatabaseService;
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      if (!this.initPromise) {
        this.initPromise = this.initialize();
      }
      await this.initPromise;
    }
  }

  private async initialize() {
    if (Platform.OS === 'web') {
      await this.initIndexedDB();
    } else {
      await this.initSQLite();
    }
    this.initialized = true;
  }

  private async initIndexedDB() {
    return new Promise<void>((resolve) => {
      const request = indexedDB.open('nutrition.db', 1);
      
      request.onerror = () => {
        console.error('Error opening IndexedDB');
        resolve();
      };

      request.onsuccess = () => {
        console.log('IndexedDB opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('user_profile')) {
          db.createObjectStore('user_profile', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('food_entries')) {
          const foodStore = db.createObjectStore('food_entries', { keyPath: 'id', autoIncrement: true });
          foodStore.createIndex('date', 'date', { unique: false });
        }

        if (!db.objectStoreNames.contains('daily_data')) {
          const dailyStore = db.createObjectStore('daily_data', { keyPath: 'date' });
        }

        if (!db.objectStoreNames.contains('streak_data')) {
          const streakStore = db.createObjectStore('streak_data', { keyPath: 'id' });
        }
      };
    });
  }

  private async initSQLite() {
    const db = SQLite.openDatabase('nutrition.db');
    return new Promise<void>((resolve, reject) => {
      db.transaction(tx => {
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

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS daily_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT UNIQUE,
            waterGlasses INTEGER DEFAULT 0,
            weight REAL,
            notes TEXT
          )`
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS streak_data (
            id INTEGER PRIMARY KEY DEFAULT 1,
            currentStreak INTEGER DEFAULT 0,
            longestStreak INTEGER DEFAULT 0,
            lastLogDate TEXT,
            totalDaysLogged INTEGER DEFAULT 0
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
  }

  private async openIndexedDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('nutrition.db', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async saveUserProfile(profile: UserProfile) {
    await this.ensureInitialized();
    
    if (Platform.OS === 'web') {
      const db = await this.openIndexedDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(['user_profile'], 'readwrite');
        const store = transaction.objectStore('user_profile');
        const request = store.put(profile);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      const db = SQLite.openDatabase('nutrition.db');
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
    }
  }

  async getUserProfile(): Promise<UserProfile | null> {
    await this.ensureInitialized();
    
    if (Platform.OS === 'web') {
      const db = await this.openIndexedDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['user_profile'], 'readonly');
        const store = transaction.objectStore('user_profile');
        const request = store.getAll();

        request.onsuccess = () => {
          const profiles = request.result;
          resolve(profiles.length > 0 ? profiles[0] : null);
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const db = SQLite.openDatabase('nutrition.db');
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
    }
  }

  async saveFoodEntry(entry: FoodEntry) {
    await this.ensureInitialized();
    
    if (Platform.OS === 'web') {
      const db = await this.openIndexedDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(['food_entries'], 'readwrite');
        const store = transaction.objectStore('food_entries');
        const request = store.put(entry);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      const db = SQLite.openDatabase('nutrition.db');
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
    }
  }

  async getFoodEntries(date: string): Promise<FoodEntry[]> {
    await this.ensureInitialized();
    
    if (Platform.OS === 'web') {
      const db = await this.openIndexedDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['food_entries'], 'readonly');
        const store = transaction.objectStore('food_entries');
        const request = store.getAll();

        request.onsuccess = () => {
          const entries = request.result;
          const foodEntries: FoodEntry[] = [];
          for (let i = 0; i < entries.length; i++) {
            if (entries[i].date === date) {
              foodEntries.push(entries[i] as FoodEntry);
            }
          }
          resolve(foodEntries);
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const db = SQLite.openDatabase('nutrition.db');
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM food_entries WHERE date = ?',
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
    }
  }

  async deleteFoodEntry(id: number) {
    await this.ensureInitialized();
    
    if (Platform.OS === 'web') {
      const db = await this.openIndexedDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(['food_entries'], 'readwrite');
        const store = transaction.objectStore('food_entries');
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      const db = SQLite.openDatabase('nutrition.db');
      return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'DELETE FROM food_entries WHERE id = ?',
            [id],
            () => resolve(),
            (_, error) => {
              console.error('Error deleting food entry:', error);
              reject(error);
              return false;
            }
          );
        });
      });
    }
  }

  async saveDailyData(data: DailyData) {
    await this.ensureInitialized();
    
    if (Platform.OS === 'web') {
      const db = await this.openIndexedDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(['daily_data'], 'readwrite');
        const store = transaction.objectStore('daily_data');
        const request = store.put(data);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      const db = SQLite.openDatabase('nutrition.db');
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
    }
  }

  async getDailyData(date: string): Promise<DailyData | null> {
    await this.ensureInitialized();
    
    if (Platform.OS === 'web') {
      const db = await this.openIndexedDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['daily_data'], 'readonly');
        const store = transaction.objectStore('daily_data');
        const request = store.get(date);

        request.onsuccess = () => {
          const data = request.result;
          resolve(data ? data as DailyData : null);
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const db = SQLite.openDatabase('nutrition.db');
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
    }
  }

  async getStreakData(): Promise<StreakData | null> {
    await this.ensureInitialized();
    
    if (Platform.OS === 'web') {
      const db = await this.openIndexedDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['streak_data'], 'readonly');
        const store = transaction.objectStore('streak_data');
        const request = store.get(1);

        request.onsuccess = () => {
          const data = request.result;
          resolve(data ? data as StreakData : null);
        };
        request.onerror = () => reject(request.error);
      });
    } else {
      const db = SQLite.openDatabase('nutrition.db');
      return new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM streak_data WHERE id = 1',
            [],
            (_, { rows }) => {
              if (rows.length > 0) {
                resolve(rows.item(0) as StreakData);
              } else {
                resolve(null);
              }
            },
            (_, error) => {
              console.error('Error getting streak data:', error);
              reject(error);
              return false;
            }
          );
        });
      });
    }
  }

  async saveStreakData(data: StreakData) {
    await this.ensureInitialized();
    
    if (Platform.OS === 'web') {
      const db = await this.openIndexedDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(['streak_data'], 'readwrite');
        const store = transaction.objectStore('streak_data');
        const request = store.put({ ...data, id: 1 });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      const db = SQLite.openDatabase('nutrition.db');
      return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            `INSERT OR REPLACE INTO streak_data (
              id, currentStreak, longestStreak, lastLogDate, totalDaysLogged
            ) VALUES (1, ?, ?, ?, ?)`,
            [
              data.currentStreak,
              data.longestStreak,
              data.lastLogDate,
              data.totalDaysLogged
            ]
          );
        }, 
        (error) => {
          console.error('Error saving streak data:', error);
          reject(error);
        },
        () => {
          resolve();
        });
      });
    }
  }

  async clearAllData() {
    await this.ensureInitialized();
    
    if (Platform.OS === 'web') {
      const db = await this.openIndexedDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(['user_profile', 'food_entries', 'daily_data', 'streak_data'], 'readwrite');
        
        const clearStore = (storeName: string) => {
          const store = transaction.objectStore(storeName);
          store.clear();
        };

        clearStore('user_profile');
        clearStore('food_entries');
        clearStore('daily_data');
        clearStore('streak_data');

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } else {
      const db = SQLite.openDatabase('nutrition.db');
      return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql('DELETE FROM user_profile');
          tx.executeSql('DELETE FROM food_entries');
          tx.executeSql('DELETE FROM daily_data');
          tx.executeSql('DELETE FROM streak_data');
        }, 
        (error) => {
          console.error('Error clearing all data:', error);
          reject(error);
        },
        () => {
          resolve();
        });
      });
    }
  }
}

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

export interface StreakData {
  id?: number;
  currentStreak: number;
  longestStreak: number;
  lastLogDate?: string;
  totalDaysLogged: number;
}

// Export a singleton instance
export const database = DatabaseService.getInstance();