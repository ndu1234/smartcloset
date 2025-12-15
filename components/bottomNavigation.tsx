
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router';
import { useTheme } from '@/lib/ThemeContext';

export default function BottomNavigation() {
    const router = useRouter();
    const { colors } = useTheme();

    return (
        <View style={{ backgroundColor: colors.background, borderColor: colors.border }} className="flex-row justify-around items-center py-3 pb-7 border-t">
            <TouchableOpacity className="items-center p-2" onPress={() => router.push('/screens/wardrobe')}>
                <Text className="text-2xl mb-1">👕</Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs">Closet</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center p-2" onPress={() => router.push('/screens/vibes')}>
                <Text className="text-2xl mb-1">✨</Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs">Vibes</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center p-2" onPress={() => router.push('/screens/explore')}>
                <Text className="text-2xl mb-1">🔍</Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs">Explore</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center p-2" onPress={() => router.push('/screens/profile')}>
                <Text className="text-2xl mb-1">👤</Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs">Profile</Text>
            </TouchableOpacity>
        </View>
    )
}