import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const backgroundImage = require('@/assets/images/abc.jpg'); // Make sure the path is correct

const LoginScreen = () => {

  const router = useRouter()

  const handleGoogleButtonPress = async () => {
    const token = await AsyncStorage.setItem('token','tokenValue');
    router.replace('/(tabs)')
    // Alert.alert('Google Login', 'Google Sign-In functionality not yet implemented.');
  };

  const handleAppleButtonPress = () => {
    Alert.alert('Apple Login', 'Apple Sign-In functionality not yet implemented.');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#DB4437' }]}
          onPress={handleGoogleButtonPress}
        >
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#000', marginTop: 12 }]}
          onPress={handleAppleButtonPress}
        >
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 32,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
