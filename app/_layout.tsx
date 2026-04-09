import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import LoadingScreen from '@/app/loading';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // TODO: 여기에 폰트 로딩/초기 데이터 로딩을 추가하면 됩니다.
        await new Promise((r) => setTimeout(r, 900));
      } finally {
        if (isMounted) setAppIsReady(true);
      }
    }

    prepare();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {appIsReady ? (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      ) : (
        <LoadingScreen />
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
