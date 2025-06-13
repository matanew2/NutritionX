import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Heart, ArrowRight } from 'lucide-react-native';
import { saveUserProfile, UserProfile } from '@/utils/storage';

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    height: '',
    currentWeight: 0,
    goalWeight: 0,
    activityLevel: 'moderate',
    goal: 'lose_weight',
  });

  const colors = {
    background: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    primary: '#4F46E5',
    accent: '#FF6B6B',
  };

  const calculateTargets = (profile: Partial<UserProfile>) => {
    // Simple BMR calculation (Mifflin-St Jeor)
    const weight = profile.currentWeight || 150;
    const height = 170; // Simplified
    const age = profile.age || 25;
    
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Male formula simplified
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    
    const tdee = bmr * activityMultipliers[profile.activityLevel || 'moderate'];
    
    let calorieTarget = tdee;
    if (profile.goal === 'lose_weight') calorieTarget -= 500;
    if (profile.goal === 'gain_muscle') calorieTarget += 300;
    
    return {
      dailyCalorieTarget: Math.round(calorieTarget),
      proteinTarget: Math.round(weight * 0.8),
      carbsTarget: Math.round(calorieTarget * 0.45 / 4),
      fatTarget: Math.round(calorieTarget * 0.25 / 9),
      waterTarget: 8,
    };
  };

  const handleComplete = async () => {
    const targets = calculateTargets(profile);
    const completeProfile: UserProfile = {
      ...profile,
      ...targets,
    } as UserProfile;
    
    await saveUserProfile(completeProfile);
    router.replace('/(tabs)');
  };

  const steps = [
    {
      title: "Hey there! 👋",
      subtitle: "Let's get to know you",
      content: (
        <View style={styles.stepContent}>
          <Text style={[styles.question, { color: colors.text }]}>
            What's your name?
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="Enter your name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      ),
    },
    {
      title: "Tell us about yourself 📊",
      subtitle: "This helps us personalize your experience",
      content: (
        <View style={styles.stepContent}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Age</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              value={profile.age?.toString()}
              onChangeText={(text) => setProfile({ ...profile, age: parseInt(text) || 0 })}
              placeholder="25"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Height</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              value={profile.height}
              onChangeText={(text) => setProfile({ ...profile, height: text })}
              placeholder=""
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Current Weight (lbs)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              value={profile.currentWeight?.toString()}
              onChangeText={(text) => setProfile({ ...profile, currentWeight: parseInt(text) || 0 })}
              placeholder="150"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      ),
    },
    {
      title: "What's your goal? 🎯",
      subtitle: "We'll customize everything for you",
      content: (
        <View style={styles.stepContent}>
          <View style={styles.optionGroup}>
            {[
              { key: 'lose_weight', label: 'Lose Weight', emoji: '📉' },
              { key: 'maintain', label: 'Maintain Weight', emoji: '⚖️' },
              { key: 'gain_muscle', label: 'Gain Muscle', emoji: '💪' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: profile.goal === option.key ? colors.primary : colors.surface,
                  },
                ]}
                onPress={() => setProfile({ ...profile, goal: option.key as any })}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: profile.goal === option.key ? 'white' : colors.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Goal Weight (lbs)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
              value={profile.goalWeight?.toString()}
              onChangeText={(text) => setProfile({ ...profile, goalWeight: parseInt(text) || 0 })}
              placeholder="140"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      ),
    },
    {
      title: "How active are you? 🏃‍♀️",
      subtitle: "This helps us calculate your calorie needs",
      content: (
        <View style={styles.stepContent}>
          <View style={styles.optionGroup}>
            {[
              { key: 'sedentary', label: 'Sedentary', emoji: '🛋️', desc: 'Little to no exercise' },
              { key: 'light', label: 'Lightly Active', emoji: '🚶‍♀️', desc: 'Light exercise 1-3 days/week' },
              { key: 'moderate', label: 'Moderately Active', emoji: '🏃‍♀️', desc: 'Moderate exercise 3-5 days/week' },
              { key: 'active', label: 'Very Active', emoji: '🏋️‍♀️', desc: 'Hard exercise 6-7 days/week' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.activityButton,
                  {
                    backgroundColor: profile.activityLevel === option.key ? colors.primary : colors.surface,
                  },
                ]}
                onPress={() => setProfile({ ...profile, activityLevel: option.key as any })}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <View style={styles.activityText}>
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: profile.activityLevel === option.key ? 'white' : colors.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.activityDesc,
                      {
                        color: profile.activityLevel === option.key ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
                      },
                    ]}
                  >
                    {option.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ),
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;
  const canProceed = step === 0 ? profile.name : true;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: index <= step ? colors.primary : colors.surface,
                  },
                ]}
              />
            ))}
          </View>
          
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.text }]}>
              {currentStep.title}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {currentStep.subtitle}
            </Text>
          </View>
        </View>

        {currentStep.content}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor: canProceed ? colors.primary : colors.surface,
            },
          ]}
          onPress={isLastStep ? handleComplete : () => setStep(step + 1)}
          disabled={!canProceed}
        >
          <Text
            style={[
              styles.nextButtonText,
              {
                color: canProceed ? 'white' : colors.textSecondary,
              },
            ]}
          >
            {isLastStep ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={20} color={canProceed ? 'white' : colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  titleSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  stepContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  question: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  optionGroup: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  activityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  activityText: {
    flex: 1,
  },
  activityDesc: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
});