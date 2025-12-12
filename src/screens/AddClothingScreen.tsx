import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  onItemAdded?: (item: { name: string; image: string; tags: string[]; style: string }) => void;
  onCancel?: () => void;
  onCloset?: () => void;
  onVibes?: () => void;
  onProfile?: () => void;
  onSearch?: () => void;
};

export default function AddClothingScreen({ onItemAdded, onCancel, onCloset, onVibes, onProfile, onSearch }: Props): JSX.Element {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Tops');
  const [selectedStyle, setSelectedStyle] = useState('Streetwear');
  const [categories, setCategories] = useState(['Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Dresses', 'Accessories']);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const styles_list = ['Streetwear', 'Casual', 'Formal', 'Athletic', 'Vintage', 'Minimalist'];

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories([...categories, newCategoryName.trim()]);
      setSelectedCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const pickImageFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your camera to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (selectedImage) {
      onItemAdded?.({ 
        name: selectedCategory, 
        image: selectedImage, 
        tags: [selectedCategory],
        style: selectedStyle
      });
      setSelectedImage(null);
      setSelectedCategory('Tops');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Item Details</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>•••</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Image Upload Area */}
          {selectedImage ? (
            <View style={styles.imageUploadArea}>
              <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
            </View>
          ) : (
            <View style={styles.imageUploadArea}>
              <View style={styles.cameraIconContainer}>
                <Text style={styles.cameraIcon}>📷</Text>
              </View>
            </View>
          )}

          {/* Image Action Buttons */}
          {selectedImage ? (
            <View style={styles.imageActions}>
              <TouchableOpacity onPress={takePhotoWithCamera} style={styles.imageActionButton}>
                <Text style={styles.imageActionText}>📷 Retake Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={pickImageFromLibrary} style={styles.imageActionButton}>
                <Text style={styles.imageActionText}>🖼️ Choose Different</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoOptionsContainer}>
              <TouchableOpacity style={styles.photoOptionButton} onPress={takePhotoWithCamera}>
                <Text style={styles.photoOptionIcon}>📷</Text>
                <Text style={styles.photoOptionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoOptionButton} onPress={pickImageFromLibrary}>
                <Text style={styles.photoOptionIcon}>🖼️</Text>
                <Text style={styles.photoOptionText}>Choose from Library</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Category Selection */}
          <Text style={styles.sectionLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
            <View style={styles.categoryPillsContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryPill,
                    selectedCategory === category && styles.categoryPillSelected
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryPillText,
                    selectedCategory === category && styles.categoryPillTextSelected
                  ]}>{category}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.addCategoryPill}
                onPress={() => {
                  setShowAddCategory(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.addCategoryPillText}>+</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Add Category Input */}
          {showAddCategory && (
            <View style={styles.addCategoryContainer}>
              <TextInput
                style={styles.addCategoryInput}
                placeholder="Enter category name..."
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus={true}
                placeholderTextColor="#999"
                onSubmitEditing={handleAddCategory}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addCategoryButton} onPress={handleAddCategory}>
                <Text style={styles.addCategoryButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelCategoryButton} onPress={() => {
                setShowAddCategory(false);
                setNewCategoryName('');
              }}>
                <Text style={styles.cancelCategoryButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Style Selection */}
          <Text style={styles.sectionLabel}>Style</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.styleScrollView}>
            <View style={styles.stylePillsContainer}>
              {styles_list.map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[
                    styles.stylePill,
                    selectedStyle === style && styles.stylePillSelected
                  ]}
                  onPress={() => setSelectedStyle(style)}
                >
                  <Text style={[
                    styles.stylePillText,
                    selectedStyle === style && styles.stylePillTextSelected
                  ]}>{style}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.saveButtonContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, !selectedImage && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={!selectedImage}
          >
            <Text style={[styles.saveButtonText, !selectedImage && styles.saveButtonTextDisabled]}>Save Item</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={onCloset}>
            <Text style={styles.navEmoji}>👕</Text>
            <Text style={styles.navLabel}>Closet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={onVibes}>
            <Text style={styles.navEmoji}>✨</Text>
            <Text style={styles.navLabel}>Vibes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navItem, styles.navItemActive]} onPress={onSearch}>
            <Text style={styles.navEmoji}>🔍</Text>
            <Text style={[styles.navLabel, styles.navLabelActive]}>Explore</Text>
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
    paddingTop: 54,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
    height: 40,
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
  menuButtonText: {
    fontSize: 18,
    color: '#1a1a1a',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageUploadArea: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    minHeight: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  cameraIconContainer: {
    opacity: 0.4,
  },
  cameraIcon: {
    fontSize: 48,
  },
  uploadedImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  imageActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
  },
  imageActionText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: '500',
  },
  photoOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  photoOptionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
  },
  photoOptionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  photoOptionText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    marginTop: 8,
  },
  categoryScrollView: {
    marginBottom: 20,
  },
  categoryPillsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryPill: {
    backgroundColor: '#e8e8e8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  categoryPillSelected: {
    backgroundColor: '#1a1a1a',
  },
  categoryPillText: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  categoryPillTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  addCategoryPill: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d0d0d0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  addCategoryPillText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '600',
  },
  addCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addCategoryInput: {
    flex: 1,
    height: 44,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
    color: '#1a1a1a',
  },
  addCategoryButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addCategoryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelCategoryButton: {
    padding: 10,
  },
  cancelCategoryButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '500',
  },
  styleScrollView: {
    marginBottom: 20,
  },
  stylePillsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  stylePill: {
    backgroundColor: '#e8e8e8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  stylePillSelected: {
    backgroundColor: '#1a1a1a',
  },
  stylePillText: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  stylePillTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f8f8',
  },
  saveButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#999',
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
