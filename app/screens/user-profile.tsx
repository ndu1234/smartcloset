import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/lib/ThemeContext';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 3;

// Mock user data - in real app this would come from an API
const usersData: { [key: string]: UserProfile } = {
  '1': {
    id: '1',
    name: 'Sarah Chen',
    handle: '@sarahstyle',
    bio: 'Fashion enthusiast | NYC based | Sustainable style advocate 🌿',
    itemCount: 234,
    followers: 12500,
    following: 342,
    items: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300',
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=300',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300',
      'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=300',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300',
    ],
  },
  '2': {
    id: '2',
    name: 'Mike Johnson',
    handle: '@mikejfits',
    bio: 'Streetwear collector | Sneakerhead 👟 | LA',
    itemCount: 156,
    followers: 8200,
    following: 198,
    items: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=300',
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=300',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300',
    ],
  },
  '3': {
    id: '3',
    name: 'Emma Wilson',
    handle: '@emmaw',
    bio: 'Minimalist wardrobe | Quality over quantity ✨',
    itemCount: 312,
    followers: 25000,
    following: 156,
    items: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300',
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=300',
    ],
  },
  '4': {
    id: '4',
    name: 'Alex Kim',
    handle: '@alexkimstyle',
    bio: 'Korean fashion | Seoul 🇰🇷 | Unisex styles',
    itemCount: 89,
    followers: 5600,
    following: 423,
    items: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300',
      'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=300',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300',
    ],
  },
};

type UserProfile = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  itemCount: number;
  followers: number;
  following: number;
  items: string[];
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default function UserProfileScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (userId && usersData[userId]) {
      setUser(usersData[userId]);
    }
  }, [userId]);

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }} className="justify-center items-center">
        <Text style={{ color: colors.text }}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-14 pb-3">
        <TouchableOpacity className="p-2" onPress={() => router.back()}>
          <Text style={{ color: colors.text }} className="text-3xl">‹</Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className="text-lg font-semibold">{user.handle}</Text>
        <TouchableOpacity className="p-2">
          <Text style={{ color: colors.text }}>•••</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center px-4 py-6">
          <View 
            style={{ backgroundColor: colors.card }} 
            className="w-24 h-24 rounded-full justify-center items-center mb-4"
          >
            <Text style={{ color: colors.text }} className="text-4xl">
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={{ color: colors.text }} className="text-xl font-bold mb-1">{user.name}</Text>
          <Text style={{ color: colors.textSecondary }} className="mb-3">{user.handle}</Text>
          <Text style={{ color: colors.text }} className="text-center px-8 mb-4">{user.bio}</Text>

          {/* Stats */}
          <View className="flex-row justify-center gap-8 mb-6">
            <View className="items-center">
              <Text style={{ color: colors.text }} className="text-xl font-bold">{user.itemCount}</Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs">Items</Text>
            </View>
            <View className="items-center">
              <Text style={{ color: colors.text }} className="text-xl font-bold">{formatNumber(user.followers)}</Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs">Followers</Text>
            </View>
            <View className="items-center">
              <Text style={{ color: colors.text }} className="text-xl font-bold">{formatNumber(user.following)}</Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs">Following</Text>
            </View>
          </View>

          {/* Follow Button */}
          <View className="flex-row gap-3 w-full px-4">
            <TouchableOpacity
              style={{ 
                backgroundColor: isFollowing ? 'transparent' : '#3897f0',
                borderColor: isFollowing ? colors.border : '#3897f0',
                borderWidth: 1
              }}
              className="flex-1 py-3 rounded-xl"
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Text 
                style={{ color: isFollowing ? colors.text : '#ffffff' }} 
                className="text-center font-semibold"
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}
              className="flex-1 py-3 rounded-xl"
            >
              <Text style={{ color: colors.text }} className="text-center font-semibold">Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={{ borderBottomColor: colors.border, borderBottomWidth: 1 }} className="flex-row">
          <TouchableOpacity className="flex-1 py-3 items-center border-b-2 border-[#3897f0]">
            <Text style={{ color: colors.text }} className="text-base">🗂️ Items</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 py-3 items-center">
            <Text style={{ color: colors.textSecondary }} className="text-base">👕 Outfits</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 py-3 items-center">
            <Text style={{ color: colors.textSecondary }} className="text-base">💫 Vibes</Text>
          </TouchableOpacity>
        </View>

        {/* Items Grid */}
        <View className="px-4 pt-4">
          {user.items.length === 0 ? (
            <View className="items-center py-8">
              <Text className="text-5xl mb-4">👗</Text>
              <Text style={{ color: colors.textSecondary }}>No items yet</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {user.items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
                  className="rounded-lg overflow-hidden"
                >
                  <Image source={{ uri: item }} className="w-full h-full" resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
