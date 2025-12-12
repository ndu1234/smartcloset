import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import EmailLoginScreen from './src/screens/EmailLoginScreen';
import AddClothingScreen from './src/screens/AddClothingScreen';
import WardrobeScreen from './src/screens/WardrobeScreen';
import VibesScreen from './src/screens/VibesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';

const USER_STORAGE_KEY = '@smartcloset_user';
const CLOTHING_STORAGE_KEY = '@smartcloset_clothing';

type ClothingItem = {
  id?: number;
  name: string;
  image: string;
  category?: string;
  tags?: string[];
  style?: string;
};

type Screen = 'landing' | 'email-login' | 'add-clothing' | 'wardrobe' | 'vibes' | 'profile' | 'search';

export default function App(): JSX.Element {
  const [user, setUser] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved user and clothing items on app start
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        const savedClothing = await AsyncStorage.getItem(CLOTHING_STORAGE_KEY);
        
        if (savedUser) {
          setUser(savedUser);
          setCurrentScreen('wardrobe');
        }
        
        if (savedClothing) {
          setClothingItems(JSON.parse(savedClothing));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Save clothing items whenever they change
  useEffect(() => {
    const saveClothingItems = async () => {
      try {
        await AsyncStorage.setItem(CLOTHING_STORAGE_KEY, JSON.stringify(clothingItems));
      } catch (error) {
        console.error('Error saving clothing items:', error);
      }
    };

    if (!isLoading && clothingItems.length > 0) {
      saveClothingItems();
    }
  }, [clothingItems, isLoading]);

  const handleGoToEmailLogin = () => {
    setCurrentScreen('email-login');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
  };

  const handleLogin = async (email: string) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, email);
      setUser(email);
      setCurrentScreen('add-clothing');
    } catch (error) {
      console.error('Error saving user:', error);
      setUser(email);
      setCurrentScreen('add-clothing');
    }
  };

  const handleItemAdded = (item: { name: string; image: string; tags?: string[]; style?: string }) => {
    setClothingItems([...clothingItems, item]);
    setCurrentScreen('wardrobe');
  };

  const handleDeleteItem = (index: number) => {
    const newItems = clothingItems.filter((_, i) => i !== index);
    setClothingItems(newItems);
  };

  const handleCancelAdd = () => {
    setCurrentScreen('wardrobe');
  };

  const handleAddMore = () => {
    setCurrentScreen('add-clothing');
  };

  const handleGoToVibes = () => {
    setCurrentScreen('vibes');
  };

  const handleBackFromVibes = () => {
    setCurrentScreen('wardrobe');
  };

  const handleGoToProfile = () => {
    setCurrentScreen('profile');
  };

  const handleBackFromProfile = () => {
    setCurrentScreen('wardrobe');
  };

  const handleGoToSearch = () => {
    setCurrentScreen('search');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(CLOTHING_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
    setUser(null);
    setCurrentScreen('landing');
    setClothingItems([]);
  };

  // Show loading screen while checking for saved user
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (currentScreen === 'landing') {
    return (
      <View style={{ flex: 1 }}>
        <LoginScreen onLogin={handleGoToEmailLogin} />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (currentScreen === 'email-login') {
    return (
      <View style={{ flex: 1 }}>
        <EmailLoginScreen onLogin={handleLogin} onBack={handleBackToLanding} />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (currentScreen === 'add-clothing') {
    return (
      <View style={{ flex: 1 }}>
        <AddClothingScreen 
          onItemAdded={handleItemAdded} 
          onCancel={handleCancelAdd}
          onCloset={() => setCurrentScreen('wardrobe')}
          onVibes={handleGoToVibes}
          onProfile={handleGoToProfile}
          onSearch={handleGoToSearch}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (currentScreen === 'vibes') {
    return (
      <View style={{ flex: 1 }}>
        <VibesScreen 
          onBack={handleBackFromVibes}
          onCloset={() => setCurrentScreen('wardrobe')}
          onAdd={handleGoToSearch}
          onProfile={handleGoToProfile}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (currentScreen === 'search') {
    return (
      <View style={{ flex: 1 }}>
        <SearchScreen
          onBack={() => setCurrentScreen('wardrobe')}
          onCloset={() => setCurrentScreen('wardrobe')}
          onVibes={handleGoToVibes}
          onProfile={handleGoToProfile}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (currentScreen === 'profile') {
    return (
      <View style={{ flex: 1 }}>
        <ProfileScreen
          username={user || 'User'}
          clothingItems={clothingItems.map((item, index) => ({
            id: String(index),
            uri: item.image,
            category: item.category || 'Other',
            style: item.style || 'Casual',
            name: item.name,
          }))}
          onBack={handleBackFromProfile}
          onAddMore={handleAddMore}
          onCloset={() => setCurrentScreen('wardrobe')}
          onVibes={handleGoToVibes}
          onSearch={handleGoToSearch}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WardrobeScreen
        username={user || ''}
        clothingItems={clothingItems}
        onAddMore={handleGoToSearch}
        onAddItem={handleAddMore}
        onLogout={handleLogout}
        onVibes={handleGoToVibes}
        onProfile={handleGoToProfile}
        onDeleteItem={handleDeleteItem}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
