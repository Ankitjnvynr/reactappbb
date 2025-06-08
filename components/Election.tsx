import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const options = [
  { label: 'Search name in voter list', icon: '👤' },
  { label: 'Know your constituency', icon: '🗂️' },
  { label: 'Enroll online', icon: '📝' },
  { label: 'Know your Election Officers', icon: '👨‍💼' },
  { label: 'Know your BLO', icon: '👥' },
  { label: 'FAQ', icon: '❓' },
  { label: 'Navigate to your polling station', icon: '🗳️' },
  { label: 'Navigate to your Voter Center', icon: '📍' },
];

const ElectionApp = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Chief Electoral Officer, Bihar</Text>

      <View style={styles.grid}>
        {options.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>

     <Image
  source={require('../assets/images/abc.jpg')}
  style={styles.footerImage}
  resizeMode="cover"
/>

      <Text style={styles.footerText}>www.ceobihar.gov.in | Help</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#87CEFA',
    flex: 1,
  },
  header: {
    backgroundColor: '#3f51b5',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  card: {
    width: Dimensions.get('window').width / 2 - 30,
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    fontSize: 28,
    marginBottom: 8,
  },
  label: {
    textAlign: 'center',
    fontSize: 13,
  },
  footerImage: {
    width: '100%',
    height: 120,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 10,
  },
});

export default ElectionApp;
