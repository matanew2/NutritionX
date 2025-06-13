import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { calculateDailyTotals } from '@/utils/storage';
import { database } from '@/utils/database';

interface MealSummaryProps {
  date: string;
  onDataChange: () => Promise<void>;
}

export const MealSummary: React.FC<MealSummaryProps> = ({ date, onDataChange }) => {
  const { colors } = useColorScheme();
  const [foods, setFoods] = React.useState<any[]>([]);

  const loadData = React.useCallback(async () => {
    const entries = await database.getFoodEntries(date);
    setFoods(entries);
  }, [date]);

  React.useEffect(() => {
    loadData();
  }, [date, loadData]);



  if (foods.length === 0) {
    return null;
  }

  const totals = calculateDailyTotals(foods);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>Daily Summary</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{totals.calories}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calories</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{totals.protein}g</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Protein</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{totals.carbs}g</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Carbs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>{totals.fat}g</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Fat</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
}); 