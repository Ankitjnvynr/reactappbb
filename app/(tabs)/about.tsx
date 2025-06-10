import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

const data = [
  { title: 'Ancient Magadh Empire' },
  { title: 'Mauryan Dynasty' },
  { title: 'Nalanda University' },
  { title: 'British Era & Champaran' },
  { title: 'JP Movement' },
  { title: 'Lalu Yadav Era' },
  { title: 'Nitish Kumar Governance' },
  { title: 'Bihar Legislative Assembly' },
  { title: 'Bihar in Freedom Struggle' },
];

const Tile = ({ item }) => (
  <TouchableOpacity style={styles.tile}>
    <Text style={styles.title}>{item.title}</Text>
  </TouchableOpacity>
);

const BiharHistoryPoliticsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bihar History & Politics</Text>
      <FlatList
        data={data}
        renderItem={Tile}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A', // Deep blue
  },
  header: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#1E3A8A', // Deep blue header
  },
  grid: {
    padding: 10,
  },
  tile: {
    flex: 1,
    margin: 8,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#FFFFFF', // White card
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    color: '#1E3A8A', // Blue text inside white card
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default BiharHistoryPoliticsScreen;
