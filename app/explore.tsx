import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

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
    <View className="flex-1 bg-[#f8f8f8]">
      {/* Header */}
      <View className="px-4 pt-14 pb-3">
        <Text className="text-2xl font-bold text-[#1a1a1a] mb-4">Explore</Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
            <Text className="text-gray-400 mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-base text-[#1a1a1a]"
              placeholder="Search users..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
            />
            {searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text className="text-gray-400">✕</Text>
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
              <Text className="text-[#1a1a1a]">Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isSearchFocused ? (
        /* Search Mode - Show Users */
        <ScrollView className="flex-1 bg-white" keyboardDismissMode="on-drag">
          <View className="px-4 pt-4">
            <Text className="text-base font-semibold text-[#1a1a1a] mb-3">
              {searchQuery ? 'Results' : 'Suggested'}
            </Text>
            {filteredUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                className="flex-row items-center py-3"
                onPress={() => {
                  // Could navigate to user profile
                }}
              >
                <View className="w-11 h-11 rounded-full bg-gray-200 justify-center items-center mr-3">
                  <Text className="text-lg font-semibold">{user.name.charAt(0)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-[#1a1a1a]">{user.name}</Text>
                  <Text className="text-sm text-gray-500">{user.handle} • {user.itemCount} items</Text>
                </View>
                <TouchableOpacity
                  className={`px-5 py-2 rounded-lg ${
                    followingUsers.includes(user.id)
                      ? 'bg-white border border-gray-300'
                      : 'bg-[#3897f0]'
                  }`}
                  onPress={() => handleFollow(user.id)}
                >
                  <Text className={`text-sm font-semibold ${
                    followingUsers.includes(user.id) ? 'text-[#1a1a1a]' : 'text-white'
                  }`}>
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

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center py-3 pb-7 bg-white border-t border-gray-200">
        <TouchableOpacity className="items-center p-2" onPress={() => router.push('/wardrobe')}>
          <Text className="text-2xl mb-1">👕</Text>
          <Text className="text-xs text-gray-500">Closet</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center p-2" onPress={() => router.push('/vibes')}>
          <Text className="text-2xl mb-1">✨</Text>
          <Text className="text-xs text-gray-500">Vibes</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center p-2">
          <Text className="text-2xl mb-1">🔍</Text>
          <Text className="text-xs text-gray-500">Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center p-2" onPress={() => router.push('/profile')}>
          <Text className="text-2xl mb-1">👤</Text>
          <Text className="text-xs text-gray-500">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
