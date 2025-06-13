import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Droplets, Plus, Minus } from 'lucide-react-native';

interface WaterTrackerProps {
  consumed: number;
  target: number;
  onUpdate: (newValue: number) => void;
}

export function WaterTracker({ consumed, target, onUpdate }: WaterTrackerProps) {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    primary: '#4F46E5',
    water: '#06B6D4',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
  };

  const progress = Math.min(consumed / target, 1);

  const handleIncrement = () => {
    if (consumed < target + 4) {
      onUpdate(consumed + 1);
    }
  };

  const handleDecrement = () => {
    if (consumed > 0) {
      onUpdate(consumed - 1);
    }
  };

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
              onPress={handleDecrement}
              disabled={consumed === 0}
            >
              <Minus size={16} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={[styles.count, { color: colors.text }]}>
              {consumed}/{target}
            </Text>
            
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.water }]}
              onPress={handleIncrement}
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
                  backgroundColor: index < consumed ? colors.water : colors.border,
                },
              ]}
            />
          ))}
        </View>
        
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {consumed === target
            ? '🎉 Great job! You\'ve reached your daily goal!'
            : `${target - consumed} more glasses to reach your goal`}
        </Text>
      </View>
    </View>
  );
}

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