import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/lib/ThemeContext';

const { width } = Dimensions.get('window');
const GRID_GAP = 2;
const ITEM_SIZE = (width - GRID_GAP * 2) / 3;

// Mock explore images
const exploreImages = [
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300',
  'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=300',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300',
  'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=300',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
  'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=300',
  'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=300',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300',
];

type User = {
  id: string;
  name: string;
  handle: string;
  itemCount: number;
};

const suggestedUsers: User[] = [
  { id: '1', name: 'Sarah Chen', handle: '@sarahstyle', itemCount: 234 },
  { id: '2', name: 'Mike Johnson', handle: '@mikejfits', itemCount: 156 },
  { id: '3', name: 'Emma Wilson', handle: '@emmaw', itemCount: 312 },
  { id: '4', name: 'Alex Kim', handle: '@alexkimstyle', itemCount: 89 },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [followingUsers, setFollowingUsers] = useState<string[]>([]);

  const filteredUsers = searchQuery
    ? suggestedUsers.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.handle.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : suggestedUsers;

  const handleFollow = (userId: string) => {
    setFollowingUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="px-4 pt-14 pb-3">
        <Text style={{ color: colors.text }} className="text-2xl font-bold mb-4">Explore</Text>

        {/* Search Bar */}
        <View className="flex-row items-center">
          <View style={{ backgroundColor: colors.card }} className="flex-1 flex-row items-center rounded-xl px-4 py-3">
            <Text style={{ color: colors.textSecondary }} className="mr-2">🔍</Text>
            <TextInput
              style={{ color: colors.text }}
              className="flex-1 text-base"
              placeholder="Search users..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
            />
            {searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={{ color: colors.textSecondary }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          {isSearchFocused && (
            <TouchableOpacity
              className="ml-3"
              onPress={() => {
                setSearchQuery('');
                setIsSearchFocused(false);
              }}
            >
              <Text style={{ color: colors.text }}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearchFocused ? (
        /* Search Mode - Show Users */
        <ScrollView style={{ backgroundColor: colors.background }} className="flex-1" keyboardDismissMode="on-drag">
          <View className="px-4 pt-4">
            <Text style={{ color: colors.text }} className="text-base font-semibold mb-3">
              {searchQuery ? 'Results' : 'Suggested'}
            </Text>
            {filteredUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                className="flex-row items-center py-3"
                onPress={() => {
                  router.push({ pathname: '/screens/user-profile', params: { userId: user.id } });
                }}
              >
                <View style={{ backgroundColor: colors.card }} className="w-11 h-11 rounded-full justify-center items-center mr-3">
                  <Text style={{ color: colors.text }} className="text-lg font-semibold">{user.name.charAt(0)}</Text>
                </View>
                <View className="flex-1">
                  <Text style={{ color: colors.text }} className="text-base font-semibold">{user.name}</Text>
                  <Text style={{ color: colors.textSecondary }} className="text-sm">{user.handle} • {user.itemCount} items</Text>
                </View>
                <TouchableOpacity
                  style={{ 
                    backgroundColor: followingUsers.includes(user.id) ? 'transparent' : '#3897f0',
                    borderColor: colors.border,
                    borderWidth: followingUsers.includes(user.id) ? 1 : 0
                  }}
                  className="px-5 py-2 rounded-lg"
                  onPress={() => handleFollow(user.id)}
                >
                  <Text style={{ color: followingUsers.includes(user.id) ? colors.text : '#ffffff' }} className="text-sm font-semibold">
                    {followingUsers.includes(user.id) ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        /* Explore Mode - Show Grid */
        <ScrollView className="flex-1">
          <View className="flex-row flex-wrap">
            {exploreImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={{ width: ITEM_SIZE, height: ITEM_SIZE, marginRight: (index + 1) % 3 === 0 ? 0 : GRID_GAP, marginBottom: GRID_GAP }}
              >
                <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
