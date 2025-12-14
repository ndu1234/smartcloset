import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';

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
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [customVibes, setCustomVibes] = useState<{ id: string; emoji: string; name: string }[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVibeName, setNewVibeName] = useState('');
  const [newVibeEmoji, setNewVibeEmoji] = useState('');

  const allVibes = [...defaultVibes, ...customVibes];

  const toggleVibe = (vibeId: string) => {
    setSelectedVibes(prev =>
      prev.includes(vibeId)
        ? prev.filter(id => id !== vibeId)
        : [...prev, vibeId]
    );
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
    <View className="flex-1 bg-[#f8f8f8]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-3">
        <TouchableOpacity className="p-2" onPress={() => router.push('/screens/wardrobe')}>
          <Text className="text-3xl text-[#1a1a1a]">‹</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-[#1a1a1a]">Today's Vibes</Text>
        <TouchableOpacity className="p-2">
          <Text className="text-[#1a1a1a]">•••</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" keyboardDismissMode="on-drag">
        <Text className="text-base text-gray-500 mb-6 text-center">
          How are you feeling today? Select your vibes.
        </Text>

        {/* Vibes Grid */}
        <View className="flex-row flex-wrap justify-center gap-3 mb-8">
          {allVibes.map((vibe) => (
            <TouchableOpacity
              key={vibe.id}
              className={`w-24 h-24 rounded-2xl justify-center items-center border-2 ${selectedVibes.includes(vibe.id)
                ? 'bg-[#1a1a1a] border-[#1a1a1a]'
                : 'bg-white border-gray-200'
                }`}
              onPress={() => toggleVibe(vibe.id)}
            >
              <Text className="text-3xl mb-1">{vibe.emoji}</Text>
              <Text className={`text-xs font-medium ${selectedVibes.includes(vibe.id) ? 'text-white' : 'text-[#1a1a1a]'}`}>
                {vibe.name}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Add Custom Vibe */}
          <TouchableOpacity
            className="w-24 h-24 rounded-2xl justify-center items-center border-2 border-dashed border-gray-300 bg-white"
            onPress={() => setShowAddModal(true)}
          >
            <Text className="text-3xl mb-1">+</Text>
            <Text className="text-xs text-gray-500">Add Vibe</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Vibes Summary */}
        {selectedVibes.length > 0 && (
          <View className="bg-white rounded-2xl p-4 mb-6">
            <Text className="text-sm font-medium text-[#1a1a1a] mb-3">Your vibe today:</Text>
            <View className="flex-row flex-wrap gap-2">
              {selectedVibes.map(vibeId => {
                const vibe = allVibes.find(v => v.id === vibeId);
                return vibe ? (
                  <View key={vibe.id} className="bg-gray-100 px-3 py-1 rounded-full flex-row items-center gap-1">
                    <Text>{vibe.emoji}</Text>
                    <Text className="text-sm text-[#1a1a1a]">{vibe.name}</Text>
                  </View>
                ) : null;
              })}
            </View>
          </View>
        )}

        {/* Generate Outfit Button */}
        <TouchableOpacity className="bg-[#4CAF50] py-4 rounded-full mb-8">
          <Text className="text-white text-center text-lg font-semibold">
            ✨ Generate Outfit Suggestions
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Custom Vibe Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-[#1a1a1a] mb-6 text-center">Create Custom Vibe</Text>

            <Text className="text-sm font-medium text-[#1a1a1a] mb-2">Emoji</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-4 text-base text-center text-2xl mb-4"
              placeholder="😊"
              value={newVibeEmoji}
              onChangeText={setNewVibeEmoji}
            />

            <Text className="text-sm font-medium text-[#1a1a1a] mb-2">Vibe Name</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-4 text-base text-[#1a1a1a] mb-6"
              placeholder="e.g., Cozy"
              value={newVibeName}
              onChangeText={setNewVibeName}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 border border-gray-200 py-4 rounded-full"
                onPress={() => setShowAddModal(false)}
              >
                <Text className="text-center text-[#1a1a1a] font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-[#1a1a1a] py-4 rounded-full"
                onPress={handleAddCustomVibe}
              >
                <Text className="text-center text-white font-semibold">Add Vibe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
