import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/lib/ThemeContext';

const USER_STORAGE_KEY = '@smartcloset_user';

export default function EmailLoginScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email.trim()) {
      try {
        await AsyncStorage.setItem(USER_STORAGE_KEY, email);
        router.replace('/screens/add-clothing');
      } catch (error) {
        console.error('Error saving user:', error);
        router.replace('/screens/add-clothing');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardDismissMode="on-drag"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-14 pb-3">
          <TouchableOpacity className="p-2" onPress={() => router.back()}>
            <Text style={{ color: colors.text }} className="text-3xl">‹</Text>
          </TouchableOpacity>
          <Text style={{ color: colors.text }} className="text-lg font-semibold">Sign In</Text>
          <View className="w-10" />
        </View>

        {/* Form */}
        <View className="flex-1 px-6 pt-8">
          <Text style={{ color: colors.text }} className="text-2xl font-bold mb-2">Welcome back</Text>
          <Text style={{ color: colors.textSecondary }} className="text-base mb-8">Sign in to your account</Text>

          <Text style={{ color: colors.text }} className="text-sm font-medium mb-2">Email</Text>
          <TextInput
            style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.text }}
            className="border rounded-xl px-4 py-4 text-base mb-4"
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={{ color: colors.text }} className="text-sm font-medium mb-2">Password</Text>
          <TextInput
            style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.text }}
            className="border rounded-xl px-4 py-4 text-base mb-6"
            placeholder="Enter your password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity className="self-end mb-8">
            <Text style={{ color: colors.textSecondary }} className="text-sm">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: isDark ? '#ffffff' : '#1a1a1a' }}
            className="py-4 rounded-full"
            onPress={handleLogin}
          >
            <Text style={{ color: isDark ? '#1a1a1a' : '#ffffff' }} className="text-center text-lg font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom */}
        <View className="px-6 pb-8">
          <Text style={{ color: colors.textSecondary }} className="text-center">
            Don't have an account?{' '}
            <Text style={{ color: colors.text }} className="font-semibold">Sign Up</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
