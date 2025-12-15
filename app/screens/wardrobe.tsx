import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Modal, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/lib/ThemeContext';

const CLOTHING_STORAGE_KEY = '@smartcloset_clothing';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ClothingItem = {
  id: number;
  name: string;
  image: string;
  category?: string;
  style?: string;
};

type CategoryConfig = {
  title: string;
  key: string;
  filters: string[];
};

const categories: CategoryConfig[] = [
  { title: 'Top Wear', key: 'Tops', filters: ['All', 'Shirt', 'Jacket', 'Hoddie', 'Denim'] },
  { title: 'Bottom Wear', key: 'Bottoms', filters: ['All', 'Chinos', 'Baggie', 'Trouser', 'Denim'] },
  { title: 'Accessories', key: 'Accessories', filters: ['All', 'Watch', 'Wallet', 'Chains', 'Denim'] },
  { title: 'Shoes', key: 'Shoes', filters: ['All', 'Sneakers', 'Boots', 'Loafers', 'Sandals'] },
  { title: 'Outerwear', key: 'Outerwear', filters: ['All', 'Jacket', 'Coat', 'Blazer', 'Vest'] },
];

export default function WardrobeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string }>({});
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  useEffect(() => {
    loadClothingItems();
    // Initialize filters
    const initialFilters: { [key: string]: string } = {};
    categories.forEach(cat => {
      initialFilters[cat.key] = 'All';
    });
    setSelectedFilters(initialFilters);
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

  const getItemsByCategory = (categoryKey: string) => {
    return clothingItems.filter(item => item.category === categoryKey);
  };

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

  const handleDeleteItem = (item: ClothingItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const newItems = clothingItems.filter(i => i.id !== item.id);
            setClothingItems(newItems);
            await AsyncStorage.setItem(CLOTHING_STORAGE_KEY, JSON.stringify(newItems));
          }
        }
      ]
    );
  };

  const handleDeleteFromModal = () => {
    if (!selectedItem) return;
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${selectedItem.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const newItems = clothingItems.filter(item => item.id !== selectedItem.id);
            setClothingItems(newItems);
            await AsyncStorage.setItem(CLOTHING_STORAGE_KEY, JSON.stringify(newItems));
            setSelectedItem(null);
          }
        }
      ]
    );
  };

  const renderCategorySection = (category: CategoryConfig) => {
    const items = getItemsByCategory(category.key);
    const currentFilter = selectedFilters[category.key] || 'All';

    return (
      <View key={category.key} className="mb-6">
        {/* Section Header */}
        <View className="flex-row items-center justify-between px-4 mb-3">
          <Text style={{ color: colors.text }} className="text-lg font-bold">{category.title}</Text>
          <TouchableOpacity>
            <Text style={{ color: colors.textSecondary }} className="text-xl">⊞</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mb-3">
          <View className="flex-row gap-2">
            {category.filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={{ 
                  borderColor: currentFilter === filter ? colors.text : colors.border 
                }}
                className="px-4 py-2 rounded-full border"
                onPress={() => setSelectedFilters(prev => ({ ...prev, [category.key]: filter }))}
              >
                <Text style={{ 
                  color: currentFilter === filter ? colors.text : colors.textSecondary 
                }} className={`text-sm ${currentFilter === filter ? 'font-medium' : ''}`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Items Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          <View className="flex-row gap-3">
            {/* New Item Card */}
            <TouchableOpacity
              style={{ backgroundColor: colors.card }}
              className="w-40 h-48 rounded-2xl border-2 border-[#c4a484] border-dashed justify-center items-center"
              onPress={() => router.push('/screens/add-clothing')}
            >
              <View className="w-12 h-12 rounded-full border-2 border-[#c4a484] justify-center items-center mb-2">
                <Text className="text-[#c4a484] text-2xl">+</Text>
              </View>
              <Text className="text-[#c4a484] text-sm font-medium">New Item</Text>
            </TouchableOpacity>

            {/* Clothing Items */}
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{ backgroundColor: isDark ? '#2a2a2a' : '#ffffff' }}
                className="w-40 h-48 rounded-2xl overflow-hidden"
                onPress={() => setSelectedItem(item)}
              >
                <View className="flex-1">
                  <Image 
                    source={{ uri: item.image }} 
                    className="w-full h-full" 
                    resizeMode="contain" 
                  />
                </View>
                {/* Delete Button */}
                <TouchableOpacity
                  style={{ backgroundColor: isDark ? '#3a3a3a' : '#ffffff' }}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-lg justify-center items-center shadow-sm"
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item);
                  }}
                >
                  <Text style={{ color: colors.textSecondary }}>🗑</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-4">
        <TouchableOpacity className="p-2" onPress={() => router.back()}>
          <Text style={{ color: colors.text }} className="text-2xl">‹</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className="text-lg font-semibold">My Wardrobe</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {categories.map(renderCategorySection)}
        <View className="h-24" />
      </ScrollView>

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
              <TouchableOpacity className="flex-row items-center bg-red-500/90 px-6 py-3 rounded-full gap-2" onPress={handleDeleteFromModal}>
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
