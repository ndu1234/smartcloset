import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

interface ClothingItem {
  id: string;
  uri: string;
  category: string;
  style: string;
  name?: string;
}

interface Props {
  username: string;
  clothingItems: ClothingItem[];
  onBack: () => void;
  onAddMore: () => void;
  onCloset?: () => void;
  onVibes?: () => void;
  onSearch?: () => void;
}

interface CategoryFilter {
  id: string;
  label: string;
  icon: string;
}

const categories: CategoryFilter[] = [
  { id: 'all', label: 'All', icon: '👔' },
  { id: 'tops', label: 'Tops', icon: '👕' },
  { id: 'bottoms', label: 'Bottoms', icon: '👖' },
  { id: 'footwear', label: 'Footwear', icon: '👟' },
  { id: 'fullbody', label: 'Full body', icon: '👗' },
  { id: 'outerwear', label: 'Outerwear', icon: '🧥' },
  { id: 'accessories', label: 'Accessories', icon: '👜' },
];

export default function ProfileScreen({ username, clothingItems, onBack, onAddMore, onCloset, onVibes, onSearch }: Props): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredItems = clothingItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || 
      item.category.toLowerCase().includes(selectedCategory) ||
      (selectedCategory === 'fullbody' && item.category.toLowerCase() === 'dresses') ||
      (selectedCategory === 'footwear' && item.category.toLowerCase() === 'shoes');
    
    const matchesSearch = !searchQuery || 
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Get a representative image for each category from user's items
  const getCategoryImage = (categoryId: string): string | null => {
    const categoryMap: { [key: string]: string[] } = {
      'all': [],
      'tops': ['tops', 'top'],
      'bottoms': ['bottoms', 'bottom', 'pants', 'shorts'],
      'footwear': ['shoes', 'footwear', 'sneakers'],
      'fullbody': ['dresses', 'dress', 'jumpsuit'],
      'outerwear': ['outerwear', 'jacket', 'coat'],
      'accessories': ['accessories', 'accessory', 'bag'],
    };

    const searchTerms = categoryMap[categoryId] || [];
    const item = clothingItems.find(item => 
      searchTerms.some(term => item.category.toLowerCase().includes(term))
    );
    return item?.uri || null;
  };

  const itemCount = clothingItems.length;
  const outfitCount = Math.floor(clothingItems.length / 3); // Simulated outfit count

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>{username.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={styles.profileName}>{username}</Text>
          <Text style={styles.profileHandle}>@{username.toLowerCase().replace(/\s/g, '')}</Text>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{itemCount}</Text>
              <Text style={styles.statLabel}>Items</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{outfitCount}</Text>
              <Text style={styles.statLabel}>Outfits</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Lookbooks</Text>
            </View>
          </View>
        </View>

        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => {
            const categoryImage = getCategoryImage(category.id);
            const isSelected = selectedCategory === category.id;
            
            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={[
                  styles.categoryCircle,
                  isSelected && styles.categoryCircleSelected
                ]}>
                  {categoryImage && category.id !== 'all' ? (
                    <Image source={{ uri: categoryImage }} style={styles.categoryImage} />
                  ) : (
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                  )}
                </View>
                <Text style={[
                  styles.categoryLabel,
                  isSelected && styles.categoryLabelSelected
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search items"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconButtonText}>♡</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconButtonText}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Clothing Grid */}
        <View style={styles.gridContainer}>
          {filteredItems.length > 0 ? (
            <View style={styles.grid}>
              {filteredItems.map((item) => (
                <View key={item.id} style={styles.gridItem}>
                  <Image source={{ uri: item.uri }} style={styles.itemImage} />
                  <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <Text style={[
                      styles.favoriteIcon,
                      favorites.includes(item.id) && styles.favoriteIconActive
                    ]}>
                      {favorites.includes(item.id) ? '❤️' : '🤍'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👕</Text>
              <Text style={styles.emptyTitle}>No items yet</Text>
              <Text style={styles.emptySubtitle}>
                Start adding clothes to build your closet
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={onAddMore}>
                <Text style={styles.addButtonText}>Add Items</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={onAddMore}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

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
        <TouchableOpacity style={styles.navItem} onPress={onSearch}>
          <Text style={styles.navEmoji}>🔍</Text>
          <Text style={styles.navLabel}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={styles.navEmoji}>👤</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  profileImageContainer: {
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#7cb342',
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  profileHandle: {
    fontSize: 14,
    color: '#7cb342',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  categoryScroll: {
    backgroundColor: '#fff',
    paddingBottom: 16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 8,
  },
  categoryCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCircleSelected: {
    borderColor: '#7cb342',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  categoryLabelSelected: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 20,
    color: '#666',
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 16,
  },
  favoriteIconActive: {
    transform: [{ scale: 1.1 }],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#7cb342',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7cb342',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
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
