import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Edit } from 'lucide-react-native';
import { router } from 'expo-router';

interface UserStats {
  currentWeight: number;
  goalWeight: number;
  height: string;
  age: number;
  activityLevel: string;
  goal: string;
}

interface ProfileHeaderProps {
  userStats: UserStats;
  colors: {
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
  };
}

export function ProfileHeader({ userStats, colors }: ProfileHeaderProps) {
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.avatar}
          />
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/settings')}
          >
            <Edit size={12} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            Sarah Johnson
          </Text>
          <Text style={[styles.userGoal, { color: colors.textSecondary }]}>
            {userStats.goal} • {userStats.activityLevel}
          </Text>
        </View>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {userStats.currentWeight}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Current (lbs)
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {userStats.goalWeight}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Goal (lbs)
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {userStats.height}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Height
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  editButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  userGoal: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
});