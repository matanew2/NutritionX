import React from 'react';
import { View, Text, StyleSheet, useColorScheme, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';
import { TrendingDown } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface WeightTrackerProps {
  period: 'week' | 'month' | 'year';
}

export function WeightTracker({ period }: WeightTrackerProps) {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    primary: '#4F46E5',
    success: '#10B981',
  };

  const getWeightData = () => {
    switch (period) {
      case 'week':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [
            { x: 1, y: 148.2 },
            { x: 2, y: 147.8 },
            { x: 3, y: 147.5 },
            { x: 4, y: 147.1 },
            { x: 5, y: 146.8 },
            { x: 6, y: 146.5 },
            { x: 7, y: 146.2 },
          ],
        };
      case 'month':
        return {
          labels: ['W1', 'W2', 'W3', 'W4'],
          data: [
            { x: 1, y: 150.0 },
            { x: 2, y: 148.5 },
            { x: 3, y: 147.0 },
            { x: 4, y: 146.2 },
          ],
        };
      case 'year':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [
            { x: 1, y: 155.0 },
            { x: 2, y: 152.5 },
            { x: 3, y: 150.0 },
            { x: 4, y: 148.5 },
            { x: 5, y: 147.0 },
            { x: 6, y: 146.2 },
          ],
        };
      default:
        return { labels: [], data: [] };
    }
  };

  const weightData = getWeightData();
  const currentWeight = 146.2;
  const startWeight = 155.0;
  const weightLoss = startWeight - currentWeight;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Weight Progress
      </Text>
      
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.currentWeight, { color: colors.text }]}>
              {currentWeight} lbs
            </Text>
            <Text style={[styles.weightLabel, { color: colors.textSecondary }]}>
              Current Weight
            </Text>
          </View>
          
          <View style={styles.progressBadge}>
            <TrendingDown size={16} color={colors.success} />
            <Text style={[styles.weightLoss, { color: colors.success }]}>
              -{weightLoss.toFixed(1)} lbs
            </Text>
          </View>
        </View>
        
        <VictoryChart
          theme={VictoryTheme.material}
          width={width - 80}
          height={200}
          padding={{ left: 60, top: 20, right: 40, bottom: 40 }}
        >
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${t.toFixed(1)}`}
            style={{
              axis: { stroke: colors.textSecondary, strokeOpacity: 0.1 },
              tickLabels: { fill: colors.textSecondary, fontSize: 12 },
              grid: { stroke: colors.textSecondary, strokeOpacity: 0.1 }
            }}
          />
          <VictoryAxis
            tickFormat={weightData.labels}
            style={{
              axis: { stroke: colors.textSecondary, strokeOpacity: 0.1 },
              tickLabels: { fill: colors.textSecondary, fontSize: 12 }
            }}
          />
          <VictoryLine
            data={weightData.data}
            style={{
              data: { stroke: colors.success, strokeWidth: 3 }
            }}
            animate={{
              duration: 1000,
              onLoad: { duration: 500 }
            }}
          />
        </VictoryChart>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {startWeight} lbs
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Starting
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              135 lbs
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Goal
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {(135 - currentWeight).toFixed(1)} lbs
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              To Go
            </Text>
          </View>
        </View>
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
    marginBottom: 20,
  },
  currentWeight: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  weightLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  weightLoss: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
});