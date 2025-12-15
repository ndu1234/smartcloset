import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { ThemeProvider } from '@/lib/ThemeContext';
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
  
  // Only show bottom nav on main app screens (not login pages)
  // segments will be [] for index, ['screens', 'email-login'] for email login, etc.
  const isLoginScreen = segments.length === 0 || 
                        (segments[0] === 'screens' && segments[1] === 'email-login');
  
  const showBottomNav = !isLoginScreen && segments.length > 0;

  return (
    <ThemeProvider>
      <NavThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

        <Stack screenOptions={{ headerShown: false }} />
        {showBottomNav && <BottomNavigation />}

        <PortalHost />
      </NavThemeProvider>
    </ThemeProvider>
  );
}
