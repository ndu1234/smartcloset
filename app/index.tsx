import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/lib/ThemeContext';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header Area with clothing icons */}
      <View className="flex-1 justify-center items-center pt-20">
        <View className="flex-row flex-wrap justify-center gap-4 mb-8 px-8">
          <Text className="text-5xl">👔</Text>
          <Text className="text-5xl">👗</Text>
          <Text className="text-5xl">👕</Text>
          <Text className="text-5xl">👖</Text>
          <Text className="text-5xl">👟</Text>
          <Text className="text-5xl">🧥</Text>
          <Text className="text-5xl">👒</Text>
          <Text className="text-5xl">👜</Text>
        </View>

        <Text style={{ color: colors.text }} className="text-4xl font-bold mb-2">SmartCloset</Text>
        <Text style={{ color: colors.textSecondary }} className="text-base text-center px-8">
          Your personal wardrobe assistant
        </Text>
      </View>

      {/* Bottom Section */}
      <View className="px-6 pb-12">
        <TouchableOpacity
          style={{ backgroundColor: isDark ? '#ffffff' : '#1a1a1a' }}
          className="py-4 rounded-full mb-4"
          onPress={() => router.push('/screens/email-login')}
        >
          <Text style={{ color: isDark ? '#1a1a1a' : '#ffffff' }} className="text-center text-lg font-semibold">
            Sign in with Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ borderColor: colors.border }} className="border py-4 rounded-full mb-6">
          <Text style={{ color: colors.text }} className="text-center text-lg font-semibold">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <Text style={{ color: colors.textSecondary }} className="text-center text-sm">
          By continuing, you agree to our Terms of Service
        </Text>
      </View>
    </View>
  );
}