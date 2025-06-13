import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';

interface FunWaterTrackerProps {
  consumed: number;
  target: number;
  onUpdate: (newValue: number) => void;
}

export function FunWaterTracker({ consumed, target, onUpdate }: FunWaterTrackerProps) {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    water: '#06B6D4',
    waterLight: '#67E8F9',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
  };

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

  const getWaterEmoji = () => {
    const progress = consumed / target;
    if (progress >= 1) return '🌊';
    if (progress >= 0.75) return '💧';
    if (progress >= 0.5) return '💦';
    if (progress >= 0.25) return '🚰';
    return '🥤';
  };

  const getMessage = () => {
    const progress = consumed / target;
    if (progress >= 1) return 'Hydration hero! 🏆';
    if (progress >= 0.75) return 'Almost there! 💪';
    if (progress >= 0.5) return 'Halfway hydrated! 🌟';
    if (progress >= 0.25) return 'Good start! 👍';
    return 'Time to hydrate! 💧';
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Hydration Station {getWaterEmoji()}
      </Text>
      
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.border }]}
              onPress={handleDecrement}
              disabled={consumed === 0}
            >
              <Minus size={16} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.countContainer}>
              <Text style={[styles.count, { color: colors.text }]}>
                {consumed}
              </Text>
              <Text style={[styles.countLabel, { color: colors.textSecondary }]}>
                glasses
              </Text>
            </View>
            
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
            >
              {index < consumed && (
                <View style={[styles.waterLevel, { backgroundColor: colors.waterLight }]} />
              )}
            </View>
          ))}
        </View>
        
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {getMessage()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    alignItems: 'center',
    marginHorizontal: 24,
  },
  count: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  countLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  glassContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  glass: {
    width: 28,
    height: 36,
    borderRadius: 6,
    marginHorizontal: 3,
    marginVertical: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  waterLevel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    borderRadius: 4,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});