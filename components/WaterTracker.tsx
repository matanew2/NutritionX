import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Droplet } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getDailyData, saveDailyData, getUserProfile } from '@/utils/storage';

interface WaterTrackerProps {
  date: string;
  onDataChange: () => Promise<void>;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ date, onDataChange }) => {
  const { colors } = useColorScheme();
  const [glasses, setGlasses] = React.useState(0);
  const [target, setTarget] = React.useState(8); // Default target of 8 glasses

  React.useEffect(() => {
    loadData();
  }, [date]);

  const loadData = async () => {
    const [dailyData, userProfile] = await Promise.all([
      getDailyData(date),
      getUserProfile()
    ]);
    
    setGlasses(dailyData?.waterGlasses || 0);
    setTarget(userProfile?.waterTarget || 8);
  };

  const handleAddGlass = async () => {
    const newGlasses = glasses + 1;
    setGlasses(newGlasses);
    const data = await getDailyData(date);
    await saveDailyData(date, {
      ...data,
      waterGlasses: newGlasses,
    });
    onDataChange();
  };

  const handleRemoveGlass = async () => {
    if (glasses > 0) {
      const newGlasses = glasses - 1;
      setGlasses(newGlasses);
      const data = await getDailyData(date);
      await saveDailyData(date, {
        ...data,
        waterGlasses: newGlasses,
      });
      onDataChange();
    }
  };

  const progress = Math.min(glasses / target, 1);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>Water Intake</Text>
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleRemoveGlass}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <View style={styles.counter}>
          <Droplet size={24} color={colors.primary} />
          <Text style={[styles.count, { color: colors.text }]}>{glasses}/{target}</Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>glasses</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleAddGlass}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {glasses === target
            ? '🎉 Great job! You\'ve reached your daily goal!'
            : `${target - glasses} more glasses to reach your goal`}
        </Text>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  counter: {
    alignItems: 'center',
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});