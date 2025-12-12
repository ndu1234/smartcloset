import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

type Props = {
  onLogin?: (username: string) => void;
};

export default function LoginScreen({ onLogin }: Props): JSX.Element {
  const handleGetStarted = () => {
    onLogin?.('User');
  };

  const handleLogin = () => {
    onLogin?.('User');
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        {/* Clothing Icons Grid */}
        <View style={styles.iconsContainer}>
          <View style={styles.iconsRow}>
            <Text style={styles.clothingIcon}>👕</Text>
            <Text style={[styles.clothingIcon, styles.iconLarge]}>🧥</Text>
            <Text style={styles.clothingIcon}>🧥</Text>
          </View>
          <View style={styles.iconsRow}>
            <Text style={styles.clothingIcon}>👖</Text>
            <Text style={[styles.clothingIcon, styles.iconLarge]}>👟</Text>
            <Text style={styles.clothingIcon}>🧥</Text>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>SmartCloset</Text>
          <Text style={styles.subtitle}>Upload your clothes.</Text>
          <Text style={styles.subtitle}>Get perfect outfits.</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 32,
    paddingVertical: 60,
    justifyContent: 'space-between',
  },
  iconsContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  clothingIcon: {
    fontSize: 48,
    marginHorizontal: 8,
    opacity: 0.7,
  },
  iconLarge: {
    fontSize: 64,
  },
  titleSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: '400',
    lineHeight: 26,
  },
  buttonsContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  getStartedButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    paddingVertical: 12,
  },
  loginButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '500',
  },
});
