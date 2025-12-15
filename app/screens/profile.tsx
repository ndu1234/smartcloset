import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, Modal, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/lib/ThemeContext';

const USER_STORAGE_KEY = '@smartcloset_user';
const CLOTHING_STORAGE_KEY = '@smartcloset_clothing';
const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 3;

type ClothingItem = {
  id: number;
  name: string;
  image: string;
  category?: string;
  style?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, setTheme, isDark, colors } = useTheme();
  const [username, setUsername] = useState('User');
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (user) setUsername(user.split('@')[0]);

      const items = await AsyncStorage.getItem(CLOTHING_STORAGE_KEY);
      if (items) setClothingItems(JSON.parse(items));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    await AsyncStorage.removeItem(CLOTHING_STORAGE_KEY);
    router.replace('/');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-3">
        <TouchableOpacity className="p-2" onPress={() => router.push('/screens/wardrobe')}>
          <Text style={{ color: colors.text }} className="text-3xl">‹</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className="text-lg font-semibold">Profile</Text>
        <TouchableOpacity className="p-2" onPress={() => setShowSettings(true)}>
          <Text style={{ color: colors.text }} className="text-xl">⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" keyboardDismissMode="on-drag">
        {/* Profile Header */}
        <View className="items-center px-4 py-6">
          <View style={{ backgroundColor: colors.card }} className="w-24 h-24 rounded-full justify-center items-center mb-4">
            <Text style={{ color: colors.text }} className="text-4xl">{username.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={{ color: colors.text }} className="text-xl font-bold mb-1">{username}</Text>
          <Text style={{ color: colors.textSecondary }}>@{username.toLowerCase().replace(/\s/g, '')}</Text>

          {/* Stats */}
          <View className="flex-row justify-center gap-12 mt-6">
            <View className="items-center">
              <Text style={{ color: colors.text }} className="text-xl font-bold">{clothingItems.length}</Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs">Items</Text>
            </View>
            <View className="items-center">
              <Text style={{ color: colors.text }} className="text-xl font-bold">{Math.floor(clothingItems.length / 3)}</Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs">Outfits</Text>
            </View>
            <View className="items-center">
              <Text style={{ color: colors.text }} className="text-xl font-bold">0</Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs">Lookbooks</Text>
            </View>
          </View>
        </View>

        {/* Clothing Grid */}
        <View className="px-4">
          <Text style={{ color: colors.text }} className="text-base font-semibold mb-4">Your Items</Text>
          {clothingItems.length === 0 ? (
            <View className="items-center py-8">
              <Text style={{ color: colors.textSecondary }}>No items yet</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {clothingItems.map((item) => (
                <View key={item.id} style={{ width: ITEM_SIZE, height: ITEM_SIZE }} className="rounded-lg overflow-hidden">
                  <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-28 right-6 w-14 h-14 rounded-full bg-[#4CAF50] justify-center items-center shadow-lg"
        onPress={() => router.push('/screens/add-clothing')}
      >
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <View className="flex-1 justify-end">
          <TouchableOpacity 
            className="flex-1" 
            activeOpacity={1} 
            onPress={() => setShowSettings(false)} 
          />
          <View style={{ backgroundColor: colors.background }} className="rounded-t-3xl px-6 pt-6 pb-12">
            {/* Handle */}
            <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-6" />
            
            <Text style={{ color: colors.text }} className="text-xl font-bold mb-6">Settings</Text>

            {/* Theme Toggle */}
            <View style={{ backgroundColor: colors.card }} className="rounded-2xl p-4 mb-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">{isDark ? '🌙' : '☀️'}</Text>
                  <View>
                    <Text style={{ color: colors.text }} className="text-base font-medium">Dark Mode</Text>
                    <Text style={{ color: colors.textSecondary }} className="text-sm">
                      {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
                  trackColor={{ false: '#e5e5e5', true: '#4CAF50' }}
                  thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Theme Options */}
            <View style={{ backgroundColor: colors.card }} className="rounded-2xl overflow-hidden mb-4">
              <TouchableOpacity 
                className="flex-row items-center justify-between p-4 border-b"
                style={{ borderColor: colors.border }}
                onPress={() => setTheme('light')}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-xl">☀️</Text>
                  <Text style={{ color: colors.text }} className="text-base">Light Theme</Text>
                </View>
                {theme === 'light' && <Text className="text-green-500 text-lg">✓</Text>}
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-row items-center justify-between p-4"
                onPress={() => setTheme('dark')}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-xl">🌙</Text>
                  <Text style={{ color: colors.text }} className="text-base">Dark Theme</Text>
                </View>
                {theme === 'dark' && <Text className="text-green-500 text-lg">✓</Text>}
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              className="bg-red-500 rounded-2xl p-4 items-center"
              onPress={handleLogout}
            >
              <Text className="text-white font-semibold text-base">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
