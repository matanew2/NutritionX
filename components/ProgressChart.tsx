import React from 'react';
import { View, Text, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

const { width } = Dimensions.get('window');

interface ProgressChartProps {
  period: 'week' | 'month' | 'year';
}

export function ProgressChart({ period }: ProgressChartProps) {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    primary: '#4F46E5',
    success: '#10B981',
    warning: '#F59E0B',
  };

  const getChartData = () => {
    switch (period) {
      case 'week':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          calories: [
            { x: 1, y: 1850 },
            { x: 2, y: 2100 },
            { x: 3, y: 1950 },
            { x: 4, y: 2200 },
            { x: 5, y: 1800 },
            { x: 6, y: 2000 },
            { x: 7, y: 1900 },
          ],
          protein: [
            { x: 1, y: 85 },
            { x: 2, y: 92 },
            { x: 3, y: 88 },
            { x: 4, y: 95 },
            { x: 5, y: 82 },
            { x: 6, y: 90 },
            { x: 7, y: 87 },
          ],
        };
      case 'month':
        return {
          labels: ['W1', 'W2', 'W3', 'W4'],
          calories: [
            { x: 1, y: 1950 },
            { x: 2, y: 2050 },
            { x: 3, y: 1900 },
            { x: 4, y: 2000 },
          ],
          protein: [
            { x: 1, y: 88 },
            { x: 2, y: 91 },
            { x: 3, y: 85 },
            { x: 4, y: 89 },
          ],
        };
      case 'year':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          calories: [
            { x: 1, y: 2000 },
            { x: 2, y: 1950 },
            { x: 3, y: 1900 },
            { x: 4, y: 1850 },
            { x: 5, y: 1800 },
            { x: 6, y: 1750 },
          ],
          protein: [
            { x: 1, y: 85 },
            { x: 2, y: 87 },
            { x: 3, y: 89 },
            { x: 4, y: 91 },
            { x: 5, y: 93 },
            { x: 6, y: 95 },
          ],
        };
      default:
        return { labels: [], calories: [], protein: [] };
    }
  };

  const chartData = getChartData();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Nutrition Trends - {period.charAt(0).toUpperCase() + period.slice(1)}
      </Text>
      
      <VictoryChart
        theme={VictoryTheme.material}
        width={width - 80}
        height={220}
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
          tickFormat={chartData.labels}
          style={{
            axis: { stroke: colors.textSecondary, strokeOpacity: 0.1 },
            tickLabels: { fill: colors.textSecondary, fontSize: 12 }
          }}
        />
        <VictoryLine
          data={chartData.calories}
          style={{
            data: { stroke: colors.primary, strokeWidth: 3 }
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 }
          }}
        />
        <VictoryLine
          data={chartData.protein}
          style={{
            data: { stroke: colors.success, strokeWidth: 3 }
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
            Calories
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>
            Protein (g)
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
    gap: 20,
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