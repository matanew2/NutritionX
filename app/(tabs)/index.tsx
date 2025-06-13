import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHealthData } from '@/hooks/useHealthData';
import { PlayfulHeader } from '@/components/PlayfulHeader';
import { FunCalorieRing } from '@/components/FunCalorieRing';
import { QuickMacros } from '@/components/QuickMacros';
import { FunWaterTracker } from '@/components/FunWaterTracker';
import { QuickAddFood } from '@/components/QuickAddFood';
import { TodaysMeals } from '@/components/TodaysMeals';

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const {
    userProfile,
    todayData,
    streak,
    loading,
    addFood,
    updateWater,
    getDailyTotals,
    refreshData,
  } = useHealthData();

  const colors = {
    background: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
  };

  const dailyTotals = getDailyTotals();
  
  // Default targets if no user profile
  const targets = userProfile ? {
    calories: userProfile.dailyCalorieTarget,
    protein: userProfile.proteinTarget,
    carbs: userProfile.carbsTarget,
    fat: userProfile.fatTarget,
    water: userProfile.waterTarget,
  } : {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
  };

  const macroData = {
    protein: { consumed: dailyTotals.protein, target: targets.protein },
    carbs: { consumed: dailyTotals.carbs, target: targets.carbs },
    fat: { consumed: dailyTotals.fat, target: targets.fat },
  };

  const handleAddFood = async (food: any) => {
    await addFood(food);
  };

  const handleUpdateWater = async (glasses: number) => {
    await updateWater(glasses);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          {/* Simple loading state */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PlayfulHeader 
          userName={userProfile?.name || 'Friend'} 
          streak={streak} 
        />

        <FunCalorieRing
          consumed={dailyTotals.calories}
          target={targets.calories}
        />

        <QuickMacros macros={macroData} />

        <FunWaterTracker
          consumed={todayData?.waterGlasses || 0}
          target={targets.water}
          onUpdate={handleUpdateWater}
        />

        <QuickAddFood onAddFood={handleAddFood} />

        <TodaysMeals 
          meals={todayData?.foods || []}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});