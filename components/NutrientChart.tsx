import React from 'react';
import { View, Text, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

const { width } = Dimensions.get('window');

export function NutrientChart() {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    primary: '#4F46E5',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  const chartData = [
    { x: 1, y: 0, label: 'Mon' },
    { x: 2, y: 0, label: 'Tue' },
    { x: 3, y: 0, label: 'Wed' },
    { x: 4, y: 0, label: 'Thu' },
    { x: 5, y: 0, label: 'Fri' },
    { x: 6, y: 0, label: 'Sat' },
    { x: 7, y: 0, label: 'Sun' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Weekly Calorie Intake
      </Text>
      
      <VictoryChart
        theme={VictoryTheme.material}
        width={width - 80}
        height={200}
        padding={{ left: 60, top: 20, right: 40, bottom: 40 }}
      >
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => `${t}`}
          style={{
            axis: { stroke: colors.textSecondary, strokeOpacity: 0.1 },
            tickLabels: { fill: colors.textSecondary, fontSize: 12 },
            grid: { stroke: colors.textSecondary, strokeOpacity: 0.1 }
          }}
        />
        <VictoryAxis
          tickFormat={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          style={{
            axis: { stroke: colors.textSecondary, strokeOpacity: 0.1 },
            tickLabels: { fill: colors.textSecondary, fontSize: 12 }
          }}
        />
        <VictoryLine
          data={chartData}
          style={{
            data: { stroke: colors.primary, strokeWidth: 3 }
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 }
          }}
        />
      </VictoryChart>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>
            Daily Calories
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});