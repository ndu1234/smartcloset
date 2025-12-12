import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import UserProfileScreen from './UserProfileScreen';

const { width } = Dimensions.get('window');
const GRID_GAP = 2;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (width - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

interface Props {
  onBack?: () => void;
  onCloset?: () => void;
  onVibes?: () => void;
  onProfile?: () => void;
}

interface User {
  id: string;
  name: string;
  handle: string;
  itemCount: number;
  avatar?: string;
}

interface ExploreItem {
  id: string;
  imageUrl: string;
  username: string;
  likes: number;
}

// Mock explore feed data - clothing from other users
const exploreFeed: ExploreItem[] = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300', username: 'fashionista', likes: 234 },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300', username: 'streetstyle', likes: 189 },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=300', username: 'minimalist', likes: 156 },
  { id: '4', imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300', username: 'vintage_lover', likes: 312 },
  { id: '5', imageUrl: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=300', username: 'casualwear', likes: 98 },
  { id: '6', imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300', username: 'luxestyle', likes: 445 },
  { id: '7', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300', username: 'sportyfit', likes: 167 },
  { id: '8', imageUrl: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=300', username: 'bohochic', likes: 278 },
  { id: '9', imageUrl: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=300', username: 'denimhead', likes: 134 },
  { id: '10', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300', username: 'modeloff', likes: 521 },
  { id: '11', imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300', username: 'elegance', likes: 387 },
  { id: '12', imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300', username: 'runway', likes: 298 },
  { id: '13', imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=300', username: 'summerstyle', likes: 176 },
  { id: '14', imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300', username: 'trendset', likes: 423 },
  { id: '15', imageUrl: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300', username: 'classicfit', likes: 267 },
];

// Initial suggested users
const initialUsers: User[] = [
  { id: '1', name: 'Alex Style', handle: '@alexstyle', itemCount: 156 },
  { id: '2', name: 'Jordan Fit', handle: '@jordanfit', itemCount: 89 },
  { id: '3', name: 'Sam Closet', handle: '@samcloset', itemCount: 234 },
  { id: '4', name: 'Taylor Wear', handle: '@taylorwear', itemCount: 67 },
  { id: '5', name: 'Morgan Vibe', handle: '@morganvibe', itemCount: 112 },
];

export default function SearchScreen({ onBack, onCloset, onVibes, onProfile }: Props): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(['fashionista', 'streetstyle', 'minimalist']);
  const [followingUsers, setFollowingUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [suggestedUsers] = useState<User[]>(initialUsers);

  const handleFollow = (userId: string) => {
    setFollowingUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleUserPress = (user: User) => {
    // Add to recent searches
    if (!recentSearches.includes(user.handle.replace('@', ''))) {
      setRecentSearches(prev => [user.handle.replace('@', ''), ...prev.slice(0, 4)]);
    }
    setSelectedUser(user);
  };

  const filteredUsers = searchQuery.trim() 
    ? suggestedUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.handle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : suggestedUsers;

  // Show user profile if selected
  if (selectedUser) {
    return (
      <UserProfileScreen
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
        onFollow={handleFollow}
        isFollowing={followingUsers.includes(selectedUser.id)}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {(searchQuery.length > 0 || isSearchFocused) && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setIsSearchFocused(false);
            }}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        {isSearchFocused && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => {
              setSearchQuery('');
              setIsSearchFocused(false);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {isSearchFocused ? (
        /* Search Mode - Show Users */
        <ScrollView style={styles.searchContent} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.recentItem}
                  onPress={() => setSearchQuery(search)}
                >
                  <View style={styles.recentIcon}>
                    <Text>🕐</Text>
                  </View>
                  <Text style={styles.recentText}>{search}</Text>
                  <TouchableOpacity style={styles.removeRecent}>
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Suggested / Search Results */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? 'Results' : 'Suggested'}
            </Text>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TouchableOpacity 
                  key={user.id} 
                  style={styles.userCard}
                  onPress={() => handleUserPress(user)}
                >
                  <View style={styles.userAvatar}>
                    <Text style={styles.userInitial}>
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userHandle}>{user.handle} • {user.itemCount} items</Text>
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.followButton,
                      followingUsers.includes(user.id) && styles.followingButton
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleFollow(user.id);
                    }}
                  >
                    <Text style={[
                      styles.followButtonText,
                      followingUsers.includes(user.id) && styles.followingButtonText
                    ]}>
                      {followingUsers.includes(user.id) ? 'Following' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No users found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        /* Explore Mode - Show Grid of Clothes */
        <ScrollView style={styles.exploreContent} showsVerticalScrollIndicator={false}>
          <View style={styles.exploreGrid}>
            {exploreFeed.map((item, index) => (
              <TouchableOpacity key={item.id} style={styles.gridItem}>
                <Image 
                  source={{ uri: item.imageUrl }} 
                  style={styles.gridImage}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

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
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text style={styles.navEmoji}>🔍</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={onProfile}>
          <Text style={styles.navEmoji}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 54,
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  clearButton: {
    fontSize: 14,
    color: '#999',
    padding: 4,
  },
  cancelButton: {
    marginLeft: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  searchContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#666',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  recentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentText: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
  },
  removeRecent: {
    padding: 8,
  },
  removeText: {
    fontSize: 14,
    color: '#999',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  userHandle: {
    fontSize: 13,
    color: '#666',
    marginTop: 1,
  },
  followButton: {
    backgroundColor: '#3897f0',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  followingButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  followingButtonText: {
    color: '#1a1a1a',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noResultsText: {
    fontSize: 15,
    color: '#666',
  },
  exploreContent: {
    flex: 1,
  },
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginRight: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
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
