import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/lib/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentWeather, getOutfitSuggestions, getTemperatureColor, WeatherData, OutfitSuggestion } from '@/lib/weatherService';

const CLOTHING_STORAGE_KEY = '@smartcloset_clothing';

const defaultVibes = [
  { id: '1', emoji: '😎', name: 'Confident' },
  { id: '2', emoji: '🌸', name: 'Soft' },
  { id: '3', emoji: '🔥', name: 'Bold' },
  { id: '4', emoji: '✨', name: 'Elegant' },
  { id: '5', emoji: '🌊', name: 'Relaxed' },
  { id: '6', emoji: '🎨', name: 'Creative' },
  { id: '7', emoji: '💼', name: 'Professional' },
  { id: '8', emoji: '🌙', name: 'Mysterious' },
];

export default function VibesScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [customVibes, setCustomVibes] = useState<{ id: string; emoji: string; name: string }[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVibeName, setNewVibeName] = useState('');
  const [newVibeEmoji, setNewVibeEmoji] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [clothingItems, setClothingItems] = useState<any[]>([]);

  useEffect(() => {
    loadWeather();
    loadClothingItems();
  }, []);

  const loadWeather = async () => {
    setLoadingWeather(true);
    const weatherData = await getCurrentWeather();
    setWeather(weatherData);
    setLoadingWeather(false);
  };

  const loadClothingItems = async () => {
    try {
      const items = await AsyncStorage.getItem(CLOTHING_STORAGE_KEY);
      if (items) setClothingItems(JSON.parse(items));
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const allVibes = [...defaultVibes, ...customVibes];

  const toggleVibe = (vibeId: string) => {
    setSelectedVibes(prev =>
      prev.includes(vibeId)
        ? prev.filter(id => id !== vibeId)
        : [...prev, vibeId]
    );
  };

  const handleGenerateOutfit = () => {
    if (weather) {
      const outfitSuggestions = getOutfitSuggestions(weather, selectedVibes, clothingItems);
      setSuggestions(outfitSuggestions);
      setShowSuggestions(true);
    }
  };

  const handleAddCustomVibe = () => {
    if (newVibeName.trim() && newVibeEmoji.trim()) {
      const newVibe = {
        id: `custom-${Date.now()}`,
        emoji: newVibeEmoji,
        name: newVibeName,
      };
      setCustomVibes([...customVibes, newVibe]);
      setNewVibeName('');
      setNewVibeEmoji('');
      setShowAddModal(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-3">
        <TouchableOpacity className="p-2" onPress={() => router.push('/screens/wardrobe')}>
          <Text style={{ color: colors.text }} className="text-3xl">‹</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className="text-lg font-semibold">Today's Vibes</Text>
        <TouchableOpacity className="p-2" onPress={loadWeather}>
          <Text style={{ color: colors.text }}>🔄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" keyboardDismissMode="on-drag">
        {/* Weather Widget */}
        <View style={{ backgroundColor: colors.card }} className="rounded-2xl p-4 mb-6">
          {loadingWeather ? (
            <View className="items-center py-4">
              <ActivityIndicator size="small" color={colors.text} />
              <Text style={{ color: colors.textSecondary }} className="text-sm mt-2">Loading weather...</Text>
            </View>
          ) : weather ? (
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className="text-5xl mr-4">{weather.icon}</Text>
                <View>
                  <Text style={{ color: colors.text }} className="text-2xl font-bold">
                    {weather.temperature}°F
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-sm">
                    Feels like {weather.feelsLike}°F
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text style={{ color: colors.text }} className="text-base font-medium">{weather.city}</Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm">{weather.conditionText}</Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs mt-1">
                  💨 {weather.windSpeed} mph • 💧 {weather.humidity}%
                </Text>
              </View>
            </View>
          ) : (
            <Text style={{ color: colors.textSecondary }} className="text-center">Unable to load weather</Text>
          )}
        </View>

        <Text style={{ color: colors.textSecondary }} className="text-base mb-4 text-center">
          How are you feeling today? Select your vibes.
        </Text>

        {/* Vibes Grid */}
        <View className="flex-row flex-wrap justify-center gap-3 mb-6">
          {allVibes.map((vibe) => (
            <TouchableOpacity
              key={vibe.id}
              style={{
                backgroundColor: selectedVibes.includes(vibe.id) 
                  ? (isDark ? '#ffffff' : '#1a1a1a')
                  : colors.card,
                borderColor: selectedVibes.includes(vibe.id)
                  ? (isDark ? '#ffffff' : '#1a1a1a')
                  : colors.border
              }}
              className="w-24 h-24 rounded-2xl justify-center items-center border-2"
              onPress={() => toggleVibe(vibe.id)}
            >
              <Text className="text-3xl mb-1">{vibe.emoji}</Text>
              <Text style={{
                color: selectedVibes.includes(vibe.id)
                  ? (isDark ? '#1a1a1a' : '#ffffff')
                  : colors.text
              }} className="text-xs font-medium">
                {vibe.name}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Add Custom Vibe */}
          <TouchableOpacity
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-24 h-24 rounded-2xl justify-center items-center border-2 border-dashed"
            onPress={() => setShowAddModal(true)}
          >
            <Text style={{ color: colors.textSecondary }} className="text-3xl mb-1">+</Text>
            <Text style={{ color: colors.textSecondary }} className="text-xs">Add Vibe</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Vibes Summary */}
        {selectedVibes.length > 0 && (
          <View style={{ backgroundColor: colors.card }} className="rounded-2xl p-4 mb-6">
            <Text style={{ color: colors.text }} className="text-sm font-medium mb-3">Your vibe today:</Text>
            <View className="flex-row flex-wrap gap-2">
              {selectedVibes.map(vibeId => {
                const vibe = allVibes.find(v => v.id === vibeId);
                return vibe ? (
                  <View key={vibe.id} style={{ backgroundColor: isDark ? '#333' : '#f3f4f6' }} className="px-3 py-1 rounded-full flex-row items-center gap-1">
                    <Text>{vibe.emoji}</Text>
                    <Text style={{ color: colors.text }} className="text-sm">{vibe.name}</Text>
                  </View>
                ) : null;
              })}
            </View>
          </View>
        )}

        {/* Generate Outfit Button */}
        <TouchableOpacity 
          className="bg-[#4CAF50] py-4 rounded-full mb-8"
          onPress={handleGenerateOutfit}
          disabled={!weather}
        >
          <Text className="text-white text-center text-lg font-semibold">
            ✨ Generate Outfit Suggestions
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Outfit Suggestions Modal */}
      <Modal
        visible={showSuggestions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSuggestions(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View style={{ backgroundColor: colors.background, maxHeight: '85%' }} className="rounded-t-3xl">
            {/* Handle */}
            <View className="w-10 h-1 bg-gray-500 rounded-full self-center mt-3 mb-2" />
            
            {/* Header with Weather */}
            <View className="px-6 py-4 border-b" style={{ borderColor: colors.border }}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text style={{ color: colors.text }} className="text-xl font-bold">Outfit Suggestions</Text>
                  <Text style={{ color: colors.textSecondary }} className="text-sm">Based on weather & your vibes</Text>
                </View>
                <TouchableOpacity onPress={() => setShowSuggestions(false)}>
                  <Text style={{ color: colors.text }} className="text-2xl">✕</Text>
                </TouchableOpacity>
              </View>
              
              {weather && (
                <View className="flex-row items-center mt-4 p-3 rounded-xl" style={{ backgroundColor: colors.card }}>
                  <Text className="text-3xl mr-3">{weather.icon}</Text>
                  <View>
                    <Text style={{ color: colors.text }} className="text-lg font-semibold">
                      {weather.temperature}°F in {weather.city}
                    </Text>
                    <Text style={{ color: colors.textSecondary }} className="text-sm">
                      {weather.conditionText} • Feels like {weather.feelsLike}°F
                    </Text>
                  </View>
                </View>
              )}
            </View>
            
            {/* Suggestions List */}
            <ScrollView className="px-6 py-4">
              {suggestions.length === 0 ? (
                <View className="items-center py-8">
                  <Text className="text-5xl mb-4">🤔</Text>
                  <Text style={{ color: colors.text }} className="text-lg font-semibold">No specific suggestions</Text>
                  <Text style={{ color: colors.textSecondary }} className="text-center mt-2">
                    Try selecting some vibes to get personalized outfit recommendations!
                  </Text>
                </View>
              ) : (
                suggestions.map((suggestion, index) => (
                  <View 
                    key={index} 
                    style={{ backgroundColor: colors.card }} 
                    className="rounded-2xl p-4 mb-4"
                  >
                    <View className="flex-row items-center mb-3">
                      <View className="w-10 h-10 rounded-full bg-[#4CAF50]/20 justify-center items-center mr-3">
                        <Text className="text-lg">👕</Text>
                      </View>
                      <Text style={{ color: colors.text }} className="text-lg font-semibold">
                        {suggestion.category}
                      </Text>
                    </View>
                    
                    <View className="flex-row flex-wrap gap-2 mb-3">
                      {suggestion.items.map((item, i) => (
                        <View 
                          key={i} 
                          style={{ backgroundColor: isDark ? '#333' : '#e5e5e5' }} 
                          className="px-3 py-1 rounded-full"
                        >
                          <Text style={{ color: colors.text }} className="text-sm">{item}</Text>
                        </View>
                      ))}
                    </View>
                    
                    <Text style={{ color: colors.textSecondary }} className="text-sm">
                      {suggestion.tip}
                    </Text>
                  </View>
                ))
              )}
              
              <TouchableOpacity 
                className="bg-[#4CAF50] py-4 rounded-full mb-8 mt-4"
                onPress={() => {
                  setShowSuggestions(false);
                  router.push('/screens/wardrobe');
                }}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  👕 Browse My Wardrobe
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Custom Vibe Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View style={{ backgroundColor: colors.background }} className="rounded-t-3xl p-6">
            <Text style={{ color: colors.text }} className="text-xl font-bold mb-6 text-center">Create Custom Vibe</Text>

            <Text style={{ color: colors.text }} className="text-sm font-medium mb-2">Emoji</Text>
            <TextInput
              style={{ backgroundColor: colors.card, color: colors.text }}
              className="rounded-xl px-4 py-4 text-base text-center text-2xl mb-4"
              placeholder="😊"
              placeholderTextColor={colors.textSecondary}
              value={newVibeEmoji}
              onChangeText={setNewVibeEmoji}
            />

            <Text style={{ color: colors.text }} className="text-sm font-medium mb-2">Vibe Name</Text>
            <TextInput
              style={{ backgroundColor: colors.card, color: colors.text }}
              className="rounded-xl px-4 py-4 text-base mb-6"
              placeholder="e.g., Cozy"
              placeholderTextColor={colors.textSecondary}
              value={newVibeName}
              onChangeText={setNewVibeName}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                style={{ borderColor: colors.border }}
                className="flex-1 border py-4 rounded-full"
                onPress={() => setShowAddModal(false)}
              >
                <Text style={{ color: colors.text }} className="text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: isDark ? '#ffffff' : '#1a1a1a' }}
                className="flex-1 py-4 rounded-full"
                onPress={handleAddCustomVibe}
              >
                <Text style={{ color: isDark ? '#1a1a1a' : '#ffffff' }} className="text-center font-semibold">Add Vibe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
