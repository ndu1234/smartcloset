
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router';

export default function BottomNavigation() {
    const router = useRouter();

    return (
        <View className="flex-row justify-around items-center py-3 pb-7 bg-white border-t border-gray-200">
            <TouchableOpacity className="items-center p-2" onPress={() => router.push('/screens/wardrobe')}>
                <Text className="text-2xl mb-1">👕</Text>
                <Text className="text-xs text-gray-500">Closet</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center p-2" onPress={() => router.push('/screens/vibes')}>
                <Text className="text-2xl mb-1">✨</Text>
                <Text className="text-xs text-gray-500">Vibes</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center p-2" onPress={() => router.push('/screens/explore')}>
                <Text className="text-2xl mb-1">🔍</Text>
                <Text className="text-xs text-gray-500">Explore</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center p-2" onPress={() => router.push('/screens/profile')}>
                <Text className="text-2xl mb-1">👤</Text>
                <Text className="text-xs text-gray-500">Profile</Text>
            </TouchableOpacity>
        </View>
    )
}