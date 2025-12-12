import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';

type Props = {
  onBack?: () => void;
  onSelectVibe?: (vibe: string) => void;
  onCloset?: () => void;
  onAdd?: () => void;
  onProfile?: () => void;
};

export default function VibesScreen({ onBack, onSelectVibe, onCloset, onAdd, onProfile }: Props): JSX.Element {
  const [vibes, setVibes] = useState([
    { emoji: '🔥', name: 'Club Night' },
    { emoji: '🍽️', name: 'Dinner Date' },
    { emoji: '☕', name: 'Chill Day' },
    { emoji: '🧢', name: 'Streetwear Run' },
    { emoji: '💼', name: 'Business Meeting' },
    { emoji: '🏋️', name: 'Gym Session' },
    { emoji: '🎉', name: 'Party Time' },
    { emoji: '🌴', name: 'Vacation Mode' },
  ]);
  const [showAddVibe, setShowAddVibe] = useState(false);
  const [newVibeName, setNewVibeName] = useState('');
  const [newVibeEmoji, setNewVibeEmoji] = useState('✨');

  const handleAddVibe = () => {
    if (newVibeName.trim()) {
      setVibes([...vibes, { emoji: newVibeEmoji, name: newVibeName.trim() }]);
      setNewVibeName('');
      setNewVibeEmoji('✨');
      setShowAddVibe(false);
    }
  };

  const handleSelectVibe = (vibeName: string) => {
    onSelectVibe?.(vibeName);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vibes</Text>
          <TouchableOpacity style={styles.menuButton} onPress={() => setShowAddVibe(true)}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Title */}
          <Text style={styles.title}>Today's vibes</Text>

          {/* Vibes Grid */}
          <View style={styles.vibesGrid}>
            {vibes.map((vibe, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.vibeCard}
                onPress={() => handleSelectVibe(vibe.name)}
              >
                <Text style={styles.vibeEmoji}>{vibe.emoji}</Text>
                <Text style={styles.vibeName}>{vibe.name}</Text>
              </TouchableOpacity>
            ))}
            {/* Add Custom Vibe Card */}
            <TouchableOpacity 
              style={[styles.vibeCard, styles.addVibeCard]}
              onPress={() => setShowAddVibe(true)}
            >
              <Text style={styles.addVibeCardIcon}>+</Text>
              <Text style={styles.addVibeCardText}>Add Vibe</Text>
            </TouchableOpacity>
          </View>

          {/* Add Custom Vibe */}
          {showAddVibe && (
            <View style={styles.addVibeContainer}>
              <Text style={styles.addVibeTitle}>Add Your Vibe</Text>
              <View style={styles.emojiSelector}>
                <Text style={styles.emojiLabel}>Emoji:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.emojiOptions}>
                    {['✨', '🎭', '🌙', '⭐', '💫', '🎪', '🎨', '🎵', '🍸', '🌸'].map((emoji) => (
                      <TouchableOpacity
                        key={emoji}
                        style={[
                          styles.emojiOption,
                          newVibeEmoji === emoji && styles.emojiOptionSelected
                        ]}
                        onPress={() => setNewVibeEmoji(emoji)}
                      >
                        <Text style={styles.emojiOptionText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
              <TextInput
                style={styles.vibeInput}
                placeholder="Enter vibe name..."
                value={newVibeName}
                onChangeText={setNewVibeName}
                placeholderTextColor="#999"
                autoFocus
              />
              <View style={styles.addVibeButtons}>
                <TouchableOpacity 
                  style={styles.cancelVibeButton} 
                  onPress={() => {
                    setShowAddVibe(false);
                    setNewVibeName('');
                  }}
                >
                  <Text style={styles.cancelVibeButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveVibeButton} onPress={handleAddVibe}>
                  <Text style={styles.saveVibeButtonText}>Add Vibe</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={onCloset}>
            <Text style={styles.navEmoji}>👕</Text>
            <Text style={styles.navLabel}>Closet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
            <Text style={styles.navEmoji}>✨</Text>
            <Text style={[styles.navLabel, styles.navLabelActive]}>Vibes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={onAdd}>
            <Text style={styles.navEmoji}>🔍</Text>
            <Text style={styles.navLabel}>Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={onProfile}>
            <Text style={styles.navEmoji}>👤</Text>
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 32,
    color: '#1a1a1a',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 28,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 24,
    textAlign: 'center',
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vibeCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  vibeEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  vibeName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    flex: 1,
  },
  addVibeCard: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    justifyContent: 'center',
  },
  addVibeCardIcon: {
    fontSize: 24,
    color: '#999',
    marginRight: 10,
  },
  addVibeCardText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#999',
  },
  addVibeContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  addVibeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  emojiSelector: {
    marginBottom: 16,
  },
  emojiLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '500',
  },
  emojiOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiOptionSelected: {
    backgroundColor: '#1a1a1a',
  },
  emojiOptionText: {
    fontSize: 22,
  },
  vibeInput: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  addVibeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelVibeButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#e8e8e8',
  },
  cancelVibeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  saveVibeButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#1a1a1a',
  },
  saveVibeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 28,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navItemActive: {
    opacity: 1,
  },
  navEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
});
