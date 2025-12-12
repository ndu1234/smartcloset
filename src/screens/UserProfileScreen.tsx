import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const GRID_GAP = 2;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (width - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

interface Props {
  user: {
    id: string;
    name: string;
    handle: string;
    itemCount: number;
    isFollowing?: boolean;
  };
  onBack: () => void;
  onFollow: (userId: string) => void;
  isFollowing: boolean;
}

// Mock clothing items for user profiles
const mockUserItems = [
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300',
  'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=300',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300',
  'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=300',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
  'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=300',
  'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=300',
];

export default function UserProfileScreen({ user, onBack, onFollow, isFollowing }: Props): JSX.Element {
  const [activeTab, setActiveTab] = useState<'closet' | 'outfits'>('closet');
  
  const followersCount = Math.floor(Math.random() * 500) + 50;
  const followingCount = Math.floor(Math.random() * 300) + 20;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.handle.replace('@', '')}</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>•••</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardDismissMode="on-drag">
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.itemCount}</Text>
                <Text style={styles.statLabel}>Items</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{followersCount}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{followingCount}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileBio}>Fashion enthusiast 👗 | Sharing my closet ✨</Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.followBtn, isFollowing && styles.followingBtn]}
              onPress={() => onFollow(user.id)}
            >
              <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageBtn}>
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'closet' && styles.activeTab]}
            onPress={() => setActiveTab('closet')}
          >
            <Text style={styles.tabIcon}>🗄️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'outfits' && styles.activeTab]}
            onPress={() => setActiveTab('outfits')}
          >
            <Text style={styles.tabIcon}>👔</Text>
          </TouchableOpacity>
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {mockUserItems.slice(0, user.itemCount > 9 ? 9 : user.itemCount).map((imageUrl, index) => (
            <TouchableOpacity key={index} style={styles.gridItem}>
              <Image source={{ uri: imageUrl }} style={styles.gridImage} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontSize: 16,
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
  },
  content: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  followBtn: {
    flex: 1,
    backgroundColor: '#3897f0',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  followBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  followingBtnText: {
    color: '#1a1a1a',
  },
  messageBtn: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  messageBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1a1a1a',
  },
  tabIcon: {
    fontSize: 24,
  },
  grid: {
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
});
