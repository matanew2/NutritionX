import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Droplets, Plus, Minus } from 'lucide-react-native';
import { getDailyData, saveDailyData } from '@/utils/storage';

interface WaterTrackerProps {
  date: string;
  onDataChange: () => Promise<void>;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ date, onDataChange }) => {
  const { colors } = useColorScheme();
  const [glasses, setGlasses] = React.useState(0);

  React.useEffect(() => {
    loadWaterData();
  }, [date]);

  const loadWaterData = async () => {
    const data = await getDailyData(date);
    setGlasses(data?.waterGlasses || 0);
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
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Water Intake
      </Text>
      
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Droplets size={20} color={colors.water} />
            <Text style={[styles.title, { color: colors.text }]}>
              Daily Hydration
            </Text>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.border }]}
              onPress={handleRemoveGlass}
              disabled={glasses === 0}
            >
              <Minus size={16} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={[styles.count, { color: colors.text }]}>
              {glasses}/{target}
            </Text>
            
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.water }]}
              onPress={handleAddGlass}
            >
              <Plus size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.glassContainer}>
          {Array.from({ length: target }, (_, index) => (
            <View
              key={index}
              style={[
                styles.glass,
                {
                  backgroundColor: index < glasses ? colors.water : colors.border,
                },
              ]}
            />
          ))}
        </View>
        
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {glasses === target
            ? '🎉 Great job! You\'ve reached your daily goal!'
            : `${target - glasses} more glasses to reach your goal`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  container: {
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginHorizontal: 12,
  },
  glassContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  glass: {
    width: 24,
    height: 32,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});