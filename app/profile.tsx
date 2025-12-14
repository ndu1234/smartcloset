import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [username, setUsername] = useState('User');
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

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
    <View className="flex-1 bg-[#f8f8f8]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-3">
        <TouchableOpacity className="p-2" onPress={() => router.push('/wardrobe')}>
          <Text className="text-3xl text-[#1a1a1a]">‹</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-[#1a1a1a]">Profile</Text>
        <TouchableOpacity className="p-2" onPress={handleLogout}>
          <Text className="text-sm text-red-500">Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" keyboardDismissMode="on-drag">
        {/* Profile Header */}
        <View className="items-center px-4 py-6">
          <View className="w-24 h-24 rounded-full bg-gray-200 justify-center items-center mb-4">
            <Text className="text-4xl">{username.charAt(0).toUpperCase()}</Text>
          </View>
          <Text className="text-xl font-bold text-[#1a1a1a] mb-1">{username}</Text>
          <Text className="text-gray-500">@{username.toLowerCase().replace(/\s/g, '')}</Text>

          {/* Stats */}
          <View className="flex-row justify-center gap-12 mt-6">
            <View className="items-center">
              <Text className="text-xl font-bold text-[#1a1a1a]">{clothingItems.length}</Text>
              <Text className="text-xs text-gray-500">Items</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-[#1a1a1a]">{Math.floor(clothingItems.length / 3)}</Text>
              <Text className="text-xs text-gray-500">Outfits</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-[#1a1a1a]">0</Text>
              <Text className="text-xs text-gray-500">Lookbooks</Text>
            </View>
          </View>
        </View>

        {/* Clothing Grid */}
        <View className="px-4">
          <Text className="text-base font-semibold text-[#1a1a1a] mb-4">Your Items</Text>
          {clothingItems.length === 0 ? (
            <View className="items-center py-8">
              <Text className="text-gray-500">No items yet</Text>
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
        onPress={() => router.push('/add-clothing')}
      >
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>
    </View>
  );
}
