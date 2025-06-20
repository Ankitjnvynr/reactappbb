import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ProfileScreen = () => {
  const router = useRouter();

  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  };

  const [walletBalance, setWalletBalance] = useState(250); // in points

  const Logout = async () => {
    Alert.alert('Logout', 'Are you sure to logout?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          router.replace('/login');
        },
      },
    ]);
  };

  const options = [
    {
      icon: 'account-balance-wallet',
      label: `Wallet: ${walletBalance} Points`,
      onpress: () =>
        Alert.alert('Wallet', `Your current wallet balance is ${walletBalance} Points`),
    },
    { icon: 'favorite', label: 'Favourites' },
    { icon: 'file-download', label: 'Downloads' },
    { icon: 'location-on', label: 'Location' },
    { icon: 'history', label: 'Clear History' },
    { icon: 'logout', label: 'Logout', onpress: Logout },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingVertical: 32 }}>
      <View style={styles.profileCard}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <TouchableOpacity style={styles.editBtn}>
          <MaterialIcons name="edit" size={16} color="#34D399" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* Wallet points display */}
        <View style={styles.walletBox}>
          <MaterialIcons name="account-balance-wallet" size={20} color="#10B981" />
          <Text style={styles.walletText}>Wallet Balance: {walletBalance} Points</Text>
        </View>
      </View>

      <View style={styles.optionList}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={item?.onpress}
            activeOpacity={0.7}
          >
            <MaterialIcons name={item.icon} size={24} color="#6b7280" />
            <Text style={styles.optionText}>{item.label}</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color="#d1d5db"
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 20,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 30,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#34D399',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editText: {
    fontSize: 14,
    marginLeft: 6,
    color: '#34D399',
    fontWeight: '600',
  },
  walletBox: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  walletText: {
    marginLeft: 8,
    color: '#10B981',
    fontWeight: '600',
    fontSize: 14,
  },
  optionList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 16,
    fontWeight: '500',
  },
});

export default ProfileScreen;
