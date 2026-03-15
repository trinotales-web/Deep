import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_400Regular_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, useApp } from './src/context/AppContext';
import { Colors } from './src/constants/theme';
import AuthScreen from './src/screens/auth/AuthScreen';
import OnboardingScreen from './src/screens/onboarding/OnboardingScreen';
import MainNavigator from './src/navigation/MainNavigator';

function LoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
      <Text style={styles.loadingBrand}>AXUNE</Text>
      <Text style={styles.loadingText}>Loading your sanctuary...</Text>
    </Animated.View>
  );
}

function AppRouter() {
  const { user, isOnboardingDone, isLoading, setOnboardingDone, darkMode } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (isLoading) return <LoadingScreen />;

  if (!user) {
    return (
      <>
        <StatusBar style="dark" />
        <AuthScreen
          onAuth={() => {
            setShowOnboarding(true);
          }}
        />
      </>
    );
  }

  if (showOnboarding || !isOnboardingDone) {
    return (
      <>
        <StatusBar style="dark" />
        <OnboardingScreen
          onComplete={async () => {
            await setOnboardingDone();
            setShowOnboarding(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <MainNavigator />
    </>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_400Regular_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.primaryText} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <AppRouter />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBrand: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 28,
    letterSpacing: 8,
    color: Colors.primaryText,
    marginBottom: 12,
  },
  loadingText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    letterSpacing: 3,
    color: Colors.mutedText,
  },
});
