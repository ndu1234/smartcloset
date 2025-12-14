import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLOTHING_STORAGE_KEY = '@smartcloset_clothing';

const categories = ['Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories'];
const styles = ['Casual', 'Formal', 'Sporty', 'Streetwear', 'Vintage'];

export default function AddClothingScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to add photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
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
      allowsEditing: true,
      aspect: [1, 1],
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
      };

      items.push(newItem);
      await AsyncStorage.setItem(CLOTHING_STORAGE_KEY, JSON.stringify(items));

      router.replace('/wardrobe');
    } catch (error) {
      console.error('Error saving item:', error);
      router.replace('/wardrobe');
    }
  };

  return (
    <View className="flex-1 bg-[#f8f8f8]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-3">
        <TouchableOpacity className="p-2" onPress={() => router.back()}>
          <Text className="text-3xl text-[#1a1a1a]">‹</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-[#1a1a1a]">Item Details</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text className="text-base font-semibold text-[#4CAF50]">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" keyboardDismissMode="on-drag">
        {/* Image Picker */}
        <TouchableOpacity
          className="bg-gray-100 rounded-2xl h-72 justify-center items-center mb-6 overflow-hidden"
          onPress={pickImage}
        >
          {image ? (
            <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="items-center">
              <Text className="text-5xl mb-3">📷</Text>
              <Text className="text-gray-500 text-base">Tap to add photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Camera/Gallery Buttons */}
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity
            className="flex-1 bg-white border border-gray-200 py-3 rounded-xl"
            onPress={takePhoto}
          >
            <Text className="text-center text-[#1a1a1a]">📸 Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-white border border-gray-200 py-3 rounded-xl"
            onPress={pickImage}
          >
            <Text className="text-center text-[#1a1a1a]">🖼️ Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Item Name */}
        <Text className="text-sm font-medium text-[#1a1a1a] mb-2">Item Name</Text>
        <TextInput
          className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-base text-[#1a1a1a] mb-6"
          placeholder="e.g., Blue Denim Jacket"
          placeholderTextColor="#999"
          value={itemName}
          onChangeText={setItemName}
        />

        {/* Category */}
        <Text className="text-sm font-medium text-[#1a1a1a] mb-3">Category</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              className={`px-4 py-2 rounded-full border ${selectedCategory === cat
                ? 'bg-[#1a1a1a] border-[#1a1a1a]'
                : 'bg-white border-gray-200'
                }`}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text className={selectedCategory === cat ? 'text-white' : 'text-[#1a1a1a]'}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Style */}
        <Text className="text-sm font-medium text-[#1a1a1a] mb-3">Style</Text>
        <View className="flex-row flex-wrap gap-2 mb-8">
          {styles.map((style) => (
            <TouchableOpacity
              key={style}
              className={`px-4 py-2 rounded-full border ${selectedStyle === style
                ? 'bg-[#1a1a1a] border-[#1a1a1a]'
                : 'bg-white border-gray-200'
                }`}
              onPress={() => setSelectedStyle(style)}
            >
              <Text className={selectedStyle === style ? 'text-white' : 'text-[#1a1a1a]'}>
                {style}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
