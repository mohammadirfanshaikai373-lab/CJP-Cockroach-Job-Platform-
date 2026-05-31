import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from './src/constants/theme';
import { AppProvider, useApp } from './src/context/AppContext';
import AuthStack from './src/navigation/AuthStack';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';

const ONBOARDING_KEY = '@cjp_onboarding_complete';

function RootApp() {
  const { currentUser } = useApp();
  const [fontsLoaded] = useFonts({ ...Ionicons.font });
  const [isReady, setIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const checkFirstLaunch = useCallback(async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem(ONBOARDING_KEY);
      setShowOnboarding(onboardingCompleted !== 'true');
    } catch (error) {
      setShowOnboarding(true);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    checkFirstLaunch();
  }, [checkFirstLaunch]);

  const handleOnboardingComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {}
    setShowOnboarding(false);
  }, []);

  if (!fontsLoaded || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      {currentUser ? <AppNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RootApp />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});