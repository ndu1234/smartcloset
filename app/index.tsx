import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#f8f8f8]">
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

        <Text className="text-4xl font-bold text-[#1a1a1a] mb-2">SmartCloset</Text>
        <Text className="text-base text-gray-500 text-center px-8">
          Your personal wardrobe assistant
        </Text>
      </View>

      {/* Bottom Section */}
      <View className="px-6 pb-12">
        <TouchableOpacity
          className="bg-[#1a1a1a] py-4 rounded-full mb-4"
          onPress={() => router.push('/email-login')}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Sign in with Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="border border-gray-300 py-4 rounded-full mb-6">
          <Text className="text-[#1a1a1a] text-center text-lg font-semibold">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-500 text-sm">
          By continuing, you agree to our Terms of Service
        </Text>
      </View>
    </View>
  );
}