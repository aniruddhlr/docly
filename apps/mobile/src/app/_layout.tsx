import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import {
  Karla_400Regular,
  Karla_500Medium,
  Karla_700Bold,
  Karla_800ExtraBold,
} from '@expo-google-fonts/karla';
import { DoclyProvider, useDocly } from '@/context/DoclyContext';
import { Toast } from '@/components/Toast';
import { AddSheet } from '@/components/AddSheet';
import { Colors } from '@/constants/theme';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

function RootAppContent() {
  const { toastMessage } = useDocly();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.cream }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.cream },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="document/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="scanner"
          options={{
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="processing"
          options={{
            headerShown: false,
            presentation: 'card',
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            headerShown: false,
            presentation: 'card',
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
      </Stack>

      <Toast message={toastMessage} />
      <AddSheet />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Karla_400Regular,
    Karla_500Medium,
    Karla_700Bold,
    Karla_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <DoclyProvider>
        <RootAppContent />
      </DoclyProvider>
    </SafeAreaProvider>
  );
}
