import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Dimensions, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ClothingItem = {
  id?: number;
  name: string;
  image: string;
  category?: string;
  tags?: string[];
  style?: string;
};

type Props = {
  username: string;
  clothingItems: ClothingItem[];
  onAddMore?: () => void;
  onAddItem?: () => void;
  onLogout?: () => void;
  onVibes?: () => void;
  onProfile?: () => void;
  onDeleteItem?: (index: number) => void;
};

export default function WardrobeScreen({ username, clothingItems, onAddMore, onAddItem, onLogout, onVibes, onProfile, onDeleteItem }: Props): JSX.Element {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const filters = ['All', 'Tops', 'Bottoms', 'Shoes', 'Outerwear'];

  const displayItems = clothingItems.length > 0 ? clothingItems : [];
  
  const filteredItems = selectedFilter === 'All' 
    ? displayItems 
    : displayItems.filter(item => item.name === selectedFilter || item.category === selectedFilter);

  const handleShare = async () => {
    if (!selectedItem) return;
    
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(selectedItem.image, {
          mimeType: 'image/jpeg',
          dialogTitle: `Share ${selectedItem.name}`,
        });
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
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
          onPress: () => {
            if (onDeleteItem && selectedIndex >= 0) {
              onDeleteItem(selectedIndex);
            }
            setSelectedItem(null);
            setSelectedIndex(-1);
          }
        }
      ]
    );
  };

  const openItemModal = (item: ClothingItem, index: number) => {
    setSelectedItem(item);
    setSelectedIndex(index);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onAddItem}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Closet</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>•••</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterTabs}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={styles.filterTab}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[
                    styles.filterText,
                    selectedFilter === filter && styles.filterTextSelected
                  ]}>{filter}</Text>
                  {selectedFilter === filter && <View style={styles.filterUnderline} />}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Clothing Grid or Empty State */}
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👗</Text>
              <Text style={styles.emptyTitle}>No items yet</Text>
              <Text style={styles.emptySubtitle}>Add some clothes to your closet</Text>
              <TouchableOpacity style={styles.addButton} onPress={onAddItem}>
                <Text style={styles.addButtonText}>+ Add Item</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {filteredItems.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.clothingCard}
                  onPress={() => openItemModal(item, clothingItems.indexOf(item))}
                >
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.clothingImage} />
                  </View>
                  <Text style={styles.itemName}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navEmoji}>👕</Text>
            <Text style={styles.navLabel}>Closet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={onVibes}>
            <Text style={styles.navEmoji}>✨</Text>
            <Text style={styles.navLabel}>Vibes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={onAddMore}>
            <Text style={styles.navEmoji}>🔍</Text>
            <Text style={styles.navLabel}>Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={onProfile}>
            <Text style={styles.navEmoji}>👤</Text>
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Full Image Modal */}
      <Modal
        visible={selectedItem !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setSelectedItem(null)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
              <View style={styles.closeButton}>
                <Text style={styles.closeButtonText}> </Text>
              </View>
            </View>

            {/* Full Image */}
            <View style={styles.fullImageContainer}>
              {selectedItem && (
                <Image 
                  source={{ uri: selectedItem.image }} 
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              )}
            </View>

            {/* Item Details */}
            {selectedItem && (
              <View style={styles.itemDetails}>
                {selectedItem.category && (
                  <View style={styles.detailPill}>
                    <Text style={styles.detailPillText}>{selectedItem.category}</Text>
                  </View>
                )}
                {selectedItem.style && (
                  <View style={styles.detailPill}>
                    <Text style={styles.detailPillText}>{selectedItem.style}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <Text style={styles.shareButtonEmoji}>📤</Text>
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonEmoji}>🗑️</Text>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  menuButtonText: {
    fontSize: 18,
    color: '#1a1a1a',
    letterSpacing: 2,
  },
  filterContainer: {
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 24,
  },
  filterTab: {
    paddingVertical: 12,
    position: 'relative',
  },
  filterText: {
    fontSize: 15,
    color: '#999',
    fontWeight: '500',
  },
  filterTextSelected: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  filterUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  clothingCard: {
    width: '48%',
    marginBottom: 16,
  },
  imageContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 1,
    marginBottom: 8,
  },
  clothingImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  navEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '300',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  fullImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  fullImage: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_HEIGHT * 0.6,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  detailPillText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3897f0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  shareButtonEmoji: {
    fontSize: 18,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  deleteButtonEmoji: {
    fontSize: 18,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
