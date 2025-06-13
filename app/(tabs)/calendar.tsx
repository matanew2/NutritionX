import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { DayMealSummary } from '@/components/DayMealSummary';
import { NutrientChart } from '@/components/NutrientChart';
import { useCalendarData } from '@/hooks/useCalendarData';
import { MealSummary } from '@/components/MealSummary';
import { WaterTracker } from '@/components/WaterTracker';
import { WeightTracker } from '@/components/WeightTracker';
import { NotesSection } from '@/components/NotesSection';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function CalendarScreen() {
  const { colors } = useColorScheme();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { markedDates, loading, getDayData, refreshData } = useCalendarData(selectedDate);
  
  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const dayData = getDayData(selectedDate);

  const calendarTheme = {
    backgroundColor: colors.surface,
    calendarBackground: colors.surface,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: '#FFFFFF',
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.textSecondary,
    dotColor: colors.primary,
    selectedDotColor: '#FFFFFF',
    arrowColor: colors.primary,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontFamily: 'Inter-Regular',
    textMonthFontFamily: 'Inter-SemiBold',
    textDayHeaderFontFamily: 'Inter-Medium',
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Food Calendar
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/add-meal')}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={[styles.calendarContainer, { backgroundColor: colors.surface }]}>
          <Calendar
            current={selectedDate}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            theme={calendarTheme}
            renderArrow={(direction) => (
              direction === 'left' ? 
                <ChevronLeft size={20} color={colors.primary} /> :
                <ChevronRight size={20} color={colors.primary} />
            )}
            enableSwipeMonths={true}
            hideExtraDays={true}
            firstDay={1}
          />
        </View>

        {/* Selected Date Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          
          <DayMealSummary date={selectedDate} />
        </View>

        {/* Weekly Nutrient Trends */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Weekly Trends
          </Text>
          <NutrientChart />
        </View>

        {/* Calendar Legend */}
        <View style={[styles.legend, { backgroundColor: colors.surface }]}>
          <Text style={[styles.legendTitle, { color: colors.text }]}>
            Legend
          </Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                Goal achieved
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                Partial goal
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                Goal missed
              </Text>
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.content}>
            <MealSummary date={selectedDate} onDataChange={refreshData} />
            <WaterTracker date={selectedDate} onDataChange={refreshData} />
            <WeightTracker date={selectedDate} onDataChange={refreshData} />
            <NotesSection date={selectedDate} onDataChange={refreshData} />
          </View>
        )}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
  legend: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  legendTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  loader: {
    marginTop: 20,
  },
  content: {
    padding: 16,
  },
});