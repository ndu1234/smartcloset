import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Modal, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';

const CLOTHING_STORAGE_KEY = '@smartcloset_clothing';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ClothingItem = {
  id: number;
  name: string;
  image: string;
  category?: string;
  style?: string;
};

const filters = ['All', 'Tops', 'Bottoms', 'Shoes', 'Outerwear'];

export default function WardrobeScreen() {
  const router = useRouter();
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  useEffect(() => {
    loadClothingItems();
  }, []);

  const loadClothingItems = async () => {
    try {
      const items = await AsyncStorage.getItem(CLOTHING_STORAGE_KEY);
      if (items) {
        setClothingItems(JSON.parse(items));
      }
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const filteredItems = selectedFilter === 'All'
    ? clothingItems
    : clothingItems.filter(item => item.category === selectedFilter);

  const handleShare = async () => {
    if (!selectedItem) return;
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(selectedItem.image);
      } else {
        Alert.alert('Sharing not available');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not share the image');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${selectedItem?.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const newItems = clothingItems.filter(item => item.id !== selectedItem?.id);
            setClothingItems(newItems);
            await AsyncStorage.setItem(CLOTHING_STORAGE_KEY, JSON.stringify(newItems));
            setSelectedItem(null);
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#f8f8f8]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-3">
        <TouchableOpacity className="p-2" onPress={() => router.push('/add-clothing')}>
          <Text className="text-3xl text-[#1a1a1a]">‹</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-[#1a1a1a]">Closet</Text>
        <TouchableOpacity className="p-2">
          <Text className="text-[#1a1a1a]">•••</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mb-4">
        <View className="flex-row gap-2">
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              className="px-4 py-2"
              onPress={() => setSelectedFilter(filter)}
            >
              <Text className={`text-base ${selectedFilter === filter ? 'text-[#1a1a1a] font-semibold' : 'text-gray-400'}`}>
                {filter}
              </Text>
              {selectedFilter === filter && (
                <View className="h-0.5 bg-[#1a1a1a] mt-1 rounded-full" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Content */}
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {filteredItems.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-5xl mb-4">👗</Text>
            <Text className="text-xl font-semibold text-[#1a1a1a] mb-2">No items yet</Text>
            <Text className="text-gray-500 mb-6">Add some clothes to your closet</Text>
            <TouchableOpacity
              className="bg-[#1a1a1a] px-8 py-3 rounded-full"
              onPress={() => router.push('/add-clothing')}
            >
              <Text className="text-white font-semibold">+ Add Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="w-[48%] mb-4"
                onPress={() => setSelectedItem(item)}
              >
                <View className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-2">
                  <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                </View>
                <Text className="text-sm font-medium text-[#1a1a1a]">{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center py-3 pb-7 bg-white border-t border-gray-200">
        <TouchableOpacity className="items-center p-2">
          <Text className="text-2xl mb-1">👕</Text>
          <Text className="text-xs text-gray-500">Closet</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center p-2" onPress={() => router.push('/vibes')}>
          <Text className="text-2xl mb-1">✨</Text>
          <Text className="text-xs text-gray-500">Vibes</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center p-2" onPress={() => router.push('/explore')}>
          <Text className="text-2xl mb-1">🔍</Text>
          <Text className="text-xs text-gray-500">Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center p-2" onPress={() => router.push('/profile')}>
          <Text className="text-2xl mb-1">👤</Text>
          <Text className="text-xs text-gray-500">Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Full Image Modal */}
      <Modal
        visible={selectedItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View className="flex-1 bg-black/95 justify-center items-center">
          <View className="w-full h-full bg-black">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-4 pt-14 pb-4">
              <TouchableOpacity className="w-10 h-10 justify-center items-center" onPress={() => setSelectedItem(null)}>
                <Text className="text-xl text-white">✕</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-white">{selectedItem?.name}</Text>
              <View className="w-10" />
            </View>

            {/* Full Image */}
            <View className="flex-1 justify-center items-center px-4">
              {selectedItem && (
                <Image
                  source={{ uri: selectedItem.image }}
                  style={{ width: SCREEN_WIDTH - 32, height: SCREEN_HEIGHT * 0.6 }}
                  resizeMode="contain"
                />
              )}
            </View>

            {/* Item Details */}
            {selectedItem && (
              <View className="flex-row justify-center gap-2 px-4 mb-4">
                {selectedItem.category && (
                  <View className="bg-white/15 px-4 py-2 rounded-full">
                    <Text className="text-white text-sm">{selectedItem.category}</Text>
                  </View>
                )}
                {selectedItem.style && (
                  <View className="bg-white/15 px-4 py-2 rounded-full">
                    <Text className="text-white text-sm">{selectedItem.style}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row justify-center gap-5 px-4 pb-12">
              <TouchableOpacity className="flex-row items-center bg-[#3897f0] px-6 py-3 rounded-full gap-2" onPress={handleShare}>
                <Text className="text-lg">📤</Text>
                <Text className="text-white font-semibold">Share</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center bg-red-500/90 px-6 py-3 rounded-full gap-2" onPress={handleDelete}>
                <Text className="text-lg">🗑️</Text>
                <Text className="text-white font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
