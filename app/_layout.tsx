import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import BottomNavigation from '@/components/bottomNavigation';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const segments = useSegments();
  const hiddenRoutes = ["email-login", "add-clothing"];

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <Stack screenOptions={{ headerShown: false }} />
      {!hiddenRoutes.includes(segments[0]) && segments.length > 0 && <BottomNavigation />}

      <PortalHost />
    </ThemeProvider>
  );
}
