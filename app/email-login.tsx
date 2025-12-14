import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY = '@smartcloset_user';

export default function EmailLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email.trim()) {
      try {
        await AsyncStorage.setItem(USER_STORAGE_KEY, email);
        router.replace('/add-clothing');
      } catch (error) {
        console.error('Error saving user:', error);
        router.replace('/add-clothing');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#f8f8f8]"
    >
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardDismissMode="on-drag"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-14 pb-3">
          <TouchableOpacity className="p-2" onPress={() => router.back()}>
            <Text className="text-3xl text-[#1a1a1a]">‹</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-[#1a1a1a]">Sign In</Text>
          <View className="w-10" />
        </View>

        {/* Form */}
        <View className="flex-1 px-6 pt-8">
          <Text className="text-2xl font-bold text-[#1a1a1a] mb-2">Welcome back</Text>
          <Text className="text-base text-gray-500 mb-8">Sign in to your account</Text>

          <Text className="text-sm font-medium text-[#1a1a1a] mb-2">Email</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base text-[#1a1a1a] mb-4"
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text className="text-sm font-medium text-[#1a1a1a] mb-2">Password</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base text-[#1a1a1a] mb-6"
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity className="self-end mb-8">
            <Text className="text-sm text-gray-500">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#1a1a1a] py-4 rounded-full"
            onPress={handleLogin}
          >
            <Text className="text-white text-center text-lg font-semibold">Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom */}
        <View className="px-6 pb-8">
          <Text className="text-center text-gray-500">
            Don't have an account?{' '}
            <Text className="text-[#1a1a1a] font-semibold">Sign Up</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
