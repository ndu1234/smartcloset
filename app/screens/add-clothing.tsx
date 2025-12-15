import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/lib/ThemeContext';

const CLOTHING_STORAGE_KEY = '@smartcloset_clothing';

const categories = ['Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories'];
const styles = ['Casual', 'Formal', 'Sporty', 'Streetwear', 'Vintage'];
const warmthLevels = ['Light', 'Medium', 'Heavy'];
const weatherTypes = ['All Weather', 'Rain-proof', 'Windproof', 'Summer Only', 'Winter Only'];

export default function AddClothingScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedWarmth, setSelectedWarmth] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!image || !itemName.trim()) {
      Alert.alert('Missing info', 'Please add a photo and name for your item');
      return;
    }

    try {
      const existingItems = await AsyncStorage.getItem(CLOTHING_STORAGE_KEY);
      const items = existingItems ? JSON.parse(existingItems) : [];

      const newItem = {
        id: Date.now(),
        name: itemName,
        image,
        category: selectedCategory,
        style: selectedStyle,
        warmth: selectedWarmth,
        weather: selectedWeather,
      };

      items.push(newItem);
      await AsyncStorage.setItem(CLOTHING_STORAGE_KEY, JSON.stringify(items));

      router.replace('/screens/wardrobe');
    } catch (error) {
      console.error('Error saving item:', error);
      router.replace('/screens/wardrobe');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-3">
        <TouchableOpacity className="p-2" onPress={() => router.back()}>
          <Text style={{ color: colors.text }} className="text-3xl">‹</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className="text-lg font-semibold">Item Details</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text className="text-base font-semibold text-[#4CAF50]">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" keyboardDismissMode="on-drag">
        {/* Image Picker */}
        <TouchableOpacity
          style={{ backgroundColor: colors.card }}
          className="rounded-2xl h-72 justify-center items-center mb-6 overflow-hidden"
          onPress={pickImage}
        >
          {image ? (
            <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="items-center">
              <Text className="text-5xl mb-3">📷</Text>
              <Text style={{ color: colors.textSecondary }} className="text-base">Tap to add photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Camera/Gallery Buttons */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="flex-1 border py-3 rounded-xl"
            onPress={takePhoto}
          >
            <Text style={{ color: colors.text }} className="text-center">📸 Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="flex-1 border py-3 rounded-xl"
            onPress={pickImage}
          >
            <Text style={{ color: colors.text }} className="text-center">🖼️ Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Item Name */}
        <Text style={{ color: colors.text }} className="text-sm font-medium mb-2">Item Name</Text>
        <TextInput
          style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.text }}
          className="border rounded-xl px-4 py-4 text-base mb-6"
          placeholder="e.g., Blue Denim Jacket"
          placeholderTextColor={colors.textSecondary}
          value={itemName}
          onChangeText={setItemName}
        />

        {/* Category */}
        <Text style={{ color: colors.text }} className="text-sm font-medium mb-3">Category</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={{
                backgroundColor: selectedCategory === cat 
                  ? (isDark ? '#ffffff' : '#1a1a1a')
                  : colors.card,
                borderColor: selectedCategory === cat
                  ? (isDark ? '#ffffff' : '#1a1a1a')
                  : colors.border
              }}
              className="px-4 py-2 rounded-full border"
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={{
                color: selectedCategory === cat
                  ? (isDark ? '#1a1a1a' : '#ffffff')
                  : colors.text
              }}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Style */}
        <Text style={{ color: colors.text }} className="text-sm font-medium mb-3">Style</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {styles.map((style) => (
            <TouchableOpacity
              key={style}
              style={{
                backgroundColor: selectedStyle === style 
                  ? (isDark ? '#ffffff' : '#1a1a1a')
                  : colors.card,
                borderColor: selectedStyle === style
                  ? (isDark ? '#ffffff' : '#1a1a1a')
                  : colors.border
              }}
              className="px-4 py-2 rounded-full border"
              onPress={() => setSelectedStyle(style)}
            >
              <Text style={{
                color: selectedStyle === style
                  ? (isDark ? '#1a1a1a' : '#ffffff')
                  : colors.text
              }}>
                {style}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Warmth Level */}
        <Text style={{ color: colors.text }} className="text-sm font-medium mb-3">Warmth Level 🌡️</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {warmthLevels.map((warmth) => (
            <TouchableOpacity
              key={warmth}
              style={{
                backgroundColor: selectedWarmth === warmth 
                  ? (warmth === 'Light' ? '#60a5fa' : warmth === 'Medium' ? '#fcd34d' : '#f87171')
                  : colors.card,
                borderColor: selectedWarmth === warmth
                  ? (warmth === 'Light' ? '#60a5fa' : warmth === 'Medium' ? '#fcd34d' : '#f87171')
                  : colors.border
              }}
              className="px-4 py-2 rounded-full border"
              onPress={() => setSelectedWarmth(warmth)}
            >
              <Text style={{
                color: selectedWarmth === warmth ? '#1a1a1a' : colors.text
              }}>
                {warmth === 'Light' ? '❄️ ' : warmth === 'Medium' ? '🌤️ ' : '🔥 '}{warmth}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weather Suitability */}
        <Text style={{ color: colors.text }} className="text-sm font-medium mb-3">Weather Suitability ☁️</Text>
        <View className="flex-row flex-wrap gap-2 mb-8">
          {weatherTypes.map((weather) => (
            <TouchableOpacity
              key={weather}
              style={{
                backgroundColor: selectedWeather === weather 
                  ? '#4CAF50'
                  : colors.card,
                borderColor: selectedWeather === weather
                  ? '#4CAF50'
                  : colors.border
              }}
              className="px-4 py-2 rounded-full border"
              onPress={() => setSelectedWeather(weather)}
            >
              <Text style={{
                color: selectedWeather === weather ? '#ffffff' : colors.text
              }}>
                {weather}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
