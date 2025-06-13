import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, TrendingUp, Award, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import { ProgressChart } from '@/components/ProgressChart';
import { AchievementCard } from '@/components/AchievementCard';
import { WeightTracker } from '@/components/WeightTracker';
import { ProgressPhotos } from '@/components/ProgressPhotos';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  const colors = {
    background: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    primary: '#4F46E5',
    success: '#10B981',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
  };

  const achievements = [
    {
      id: '1',
      title: '7-Day Streak',
      description: 'Logged meals for 7 consecutive days',
      icon: '🔥',
      completed: true,
      date: '2024-01-15',
    },
    {
      id: '2',
      title: 'Protein Goal',
      description: 'Hit protein target 5 days this week',
      icon: '💪',
      completed: true,
      date: '2024-01-18',
    },
    {
      id: '3',
      title: 'Hydration Hero',
      description: 'Drink 8 glasses of water daily',
      icon: '💧',
      completed: false,
      progress: 0.6,
    },
    {
      id: '4',
      title: 'Calorie Champion',
      description: 'Stay within calorie goals for 30 days',
      icon: '🎯',
      completed: false,
      progress: 0.8,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Your Progress
          </Text>
          <TouchableOpacity
            style={[styles.photoButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/progress-photos')}
          >
            <Camera size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                {
                  backgroundColor: selectedPeriod === period ? colors.primary : colors.surface,
                },
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  {
                    color: selectedPeriod === period ? 'white' : colors.text,
                  },
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weight Progress */}
        <WeightTracker period={selectedPeriod} />

        {/* Progress Charts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Nutrition Trends
          </Text>
          <ProgressChart period={selectedPeriod} />
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Achievements
            </Text>
            <View style={styles.achievementStats}>
              <Award size={16} color={colors.success} />
              <Text style={[styles.achievementCount, { color: colors.success }]}>
                {achievements.filter(a => a.completed).length}/{achievements.length}
              </Text>
            </View>
          </View>
          
          <View style={styles.achievementGrid}>
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                colors={colors}
              />
            ))}
          </View>
        </View>

        {/* Progress Photos Preview */}
        <ProgressPhotos />

        {/* Weekly Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <View style={styles.summaryHeader}>
            <Calendar size={20} color={colors.primary} />
            <Text style={[styles.summaryTitle, { color: colors.text }]}>
              This Week's Summary
            </Text>
          </View>
          
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                6/7
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Days logged
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                92%
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Goal accuracy
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                -1.2 lbs
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Weight change
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  photoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
});