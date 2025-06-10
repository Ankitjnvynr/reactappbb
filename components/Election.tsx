import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const width = Dimensions.get('window').width;

// ✅ Hosted images via URI (replace with your actual links)
const sectionImages = [
  { title: '👤 Search name in voter list', image: { uri: 'https://example.com/images/1.png' } },
  { title: '🗂️ Know your constituency', image: { uri: 'https://example.com/images/2.png' } },
  { title: '📝 Enroll online', image: { uri: 'https://example.com/images/3.png' } },
  { title: '👨‍💼 Know your Election Officers', image: { uri: 'https://example.com/images/4.png' } },
  { title: '👥 Know your BLO', image: { uri: 'https://example.com/images/5.png' } },
  { title: '❓ FAQ', image: { uri: 'https://example.com/images/6.png' } },
];

const carouselImages = [
  { uri: 'https://example.com/images/banner1.png' },
  { uri: 'https://example.com/images/banner2.png' },
  { uri: 'https://example.com/images/banner3.png' },
];

const ElectionApp = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.deliveryTime}>Bihar Election</Text>
          <Text style={styles.location}>Urban Estate, Patna ▼</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#1E3A8A" style={styles.searchIcon} />
          <TextInput
            placeholder='Search "voter"'
            placeholderTextColor="#1E3A8A"
            style={styles.input}
          />
          <Ionicons name="mic" size={20} color="#1E3A8A" />
        </View>

        {/* Services Grid */}
        <Text style={styles.sectionTitle}>Know Your Constituency</Text>
        <View style={styles.grid}>
          {sectionImages.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.card} activeOpacity={0.8}>
              <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Carousel */}
        <Text style={styles.sectionTitle}>Latest Announcements</Text>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carouselContainer}
        >
          {carouselImages.map((img, idx) => (
            <Image key={idx} source={img} style={styles.carouselImage} />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  deliveryTime: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  location: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 2,
  },

  searchBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#1E3A8A',
    borderWidth: 1.5,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E3A8A',
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
    color: '#1E3A8A',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  card: {
    width: width / 2 - 28,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    padding: 12,
    borderColor: '#1E3A8A',
    borderWidth: 1,
  },
  cardImage: {
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#1E3A8A',
  },

  carouselContainer: {
    marginBottom: 30,
  },
  carouselImage: {
    width: width - 32,
    height: 160,
    marginHorizontal: 16,
    borderRadius: 12,
  },
});

export default ElectionApp;
