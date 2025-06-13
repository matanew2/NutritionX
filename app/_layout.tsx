import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { getUserProfile } from '@/utils/storage';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    const checkProfile = async () => {
      const profile = await getUserProfile();
      setHasProfile(!!profile);
    };
    checkProfile();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && hasProfile !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, hasProfile]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (hasProfile === null) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {!hasProfile ? (
          <Stack.Screen name="onboarding" />
        ) : (
          <Stack.Screen name="(tabs)" />
        )}
        <Stack.Screen name="meal-details" />
        <Stack.Screen name="add-meal" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="progress-photos" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}